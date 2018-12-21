using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using PropertyManager.Helper;
using PropertyManager.Models;
using PropertyManager.Services;

namespace PropertyManager.Controllers
{
    [RoutePrefix("api/app")]
    public class PropertyAppController : BaseController
    {
        private readonly IService _service = new Service();

        [HttpPost]
        [Route("MaidLogin")]
        public EmployeeModel MaidLogin(EmployeeModel model)
        {
            var employee = _service.MaidLogin(model);
            if(Equals(employee, null))
                ExceptionContent(HttpStatusCode.Unauthorized, "Tài khoản hoặc mật khẩu sai");
            var token = new TokenModel()
            {
                Id = employee.employee_id,
                Username = employee.username,
                Role = employee.role
            };
            return new EmployeeModel()
            {
                Username = employee.username,
                Token = Encrypt.Base64Encode(JsonConvert.SerializeObject(token)),
                Role = employee.role,
                Birthday = employee.birthday,
                FirstName = employee.first_name,
                LastName = employee.last_name,
                Phone = employee.phone,
                Code = employee.code,
                Statistic = new StatisticModel()
                {
                    Room1 = 0,
                    Room2 = 0,
                    Room3 = 0
                }
            };
        }

        [HttpGet]
        [Route("GetAllIssue")]
        public List<IssueModel> GetAllIssue()
        {
            var issues = _service.GetAllIssue();
            return issues.Select(p => new IssueModel()
            {
                Id = p.issue_id,
                Name = p.name,
                Description = p.description
            }).ToList();
        }

        [HttpPost]
        [Route("GetApartmentByCode")]
        public ApartmentModel GetApartmentByCode(ApartmentEmployeeModel model)
        {
            IEnumerable<string> values;
            if (this.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if(Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var apartment = _service.GetApartmentByCode(model.ApartmentCode);
                if(Equals(apartment, null))
                    ExceptionContent(HttpStatusCode.InternalServerError, "Không tìm thấy thông tin căn hộ");

                var contract = _service.GetCurrentParentContractByApartmentId(apartment.apartment_id);
                if(Equals(contract, null))
                    ExceptionContent(HttpStatusCode.InternalServerError, "Căn hộ đã hết hạn hợp đồng");

                var contractEmployee =
                    _service.GetContractEmployeeByContractIdAndEmployeeId(contract.contract_id, maid.employee_id);
                if(Equals(contractEmployee, null) || contractEmployee.status != 1 || !Equals(contractEmployee.to_date, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Bạn không có quyền vào căn hộ này");

                var apartmentEmployee =
                    _service.GetLastApartmentEmployeeNotCheckOutByEmployeeId(maid.employee_id);
                if(!Equals(apartmentEmployee, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Bạn có 1 căn hộ chưa hoàn thành");

                apartmentEmployee = new apartment_employee()
                {
                    employee_id = maid.employee_id,
                    apartment_id = apartment.apartment_id,
                    apartment_employee_id = 0,
                    check_in_time = ConvertDatetime.GetCurrentUnixTimeStamp(),
                    check_in_geo = JsonConvert.SerializeObject(model.CheckInGeo)
                };
                _service.SaveApartmentEmployee(apartmentEmployee);

                return new ApartmentModel()
                {
                    Id = apartment.apartment_id,
                    Address = contract.address,
                    Building = contract.building,
                    NoApartment = contract.no_apartment,
                    Project = !Equals(apartment.apartment_id, null) ? new ProjectModel()
                    {
                        Name = apartment.project.project_content.FirstOrDefault(p => p.language == 0).name
                    } : new ProjectModel(),
                    Resident = new UserProfileModel()
                    {
                        FullName = contract.resident_name,
                        Phone = contract.resident_phone
                    },
                    PassWifi = contract.pass_wifi,
                    PassDoor = contract.pass_door,
                    Maid = new EmployeeModel()
                    {
                        WorkHour = contractEmployee.work_hour,
                        WorkDate = contractEmployee.work_date.Split(',').ToList(),
                        FirstName = maid.first_name,
                        LastName = maid.last_name
                    }
                };
            }
            return new ApartmentModel();
        }

        [HttpPost]
        [Route("MaidTrackingIssue")]
        public void MaidTrackingIssue(ApartmentEmployeeModel model)
        {
            IEnumerable<string> values;
            if (this.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var apartmentEmployee =
                    _service.GetLastApartmentEmployeeByApartmentIdAndEmployeeId(model.ApartmentId, maid.employee_id);
                apartmentEmployee.check_out_time = ConvertDatetime.GetCurrentUnixTimeStamp();
                apartmentEmployee.check_out_geo = JsonConvert.SerializeObject(model.CheckOutGeo);
                _service.SaveApartmentEmployee(apartmentEmployee);

                var listIssue = new List<apartment_employee_issue>();
                foreach (var item in model.ListIssue)
                {
                    var issue = new apartment_employee_issue()
                    {
                        apartment_employee_id = apartmentEmployee.apartment_employee_id,
                        issue_id = item.IssueId,
                        apartment_employee_issue_id = 0,
                        is_complete = item.IsComplete
                    };
                    listIssue.Add(issue);
                }
                _service.SaveListApartmentEmployeeIssue(listIssue);
            }
        }

        [HttpPost]
        [Route("MaidCreateProblem")]
        public void MaidCreateProblem(ProblemModel model)
        {
            IEnumerable<string> values;
            if (this.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var problem = new problem()
                {
                    created_date = ConvertDatetime.GetCurrentUnixTimeStamp(),
                    issue_id = model.IssueId,
                    description = model.Description,
                    problem_id = 0,
                    status = 0,
                    summary = model.Summary,
                    type = (int)ProblemType.Maid,
                    is_calendar = false,
                    apartment_id = model.ApartmentId,
                    employee_id = maid.employee_id
                };
                _service.SaveProblem(problem);

                int idx = 0;
                var listImage = new List<problem_image>();
                foreach (var item in model.ListImage)
                {
                    var img = new problem_image()
                    {
                        problem_id = problem.problem_id,
                        img = _service.SaveImage("~/Upload/problem/",
                            "problem_" + ConvertDatetime.GetCurrentUnixTimeStamp() + "_" + idx + ".png",
                            item.Img_Base64)
                    };
                    listImage.Add(img);
                    idx++;
                }
                _service.SaveListProblemImage(listImage);
            }

            
        }

        [HttpGet]
        [Route("MaidGetListApartment")]
        public PagingResult<ApartmentModel> MaidGetListApartment(FilterModel filter)
        {
            IEnumerable<string> values;
            if (this.Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var contracts = _service.SearchListCurrentContractByEmployeeId(filter.Search, maid.employee_id);
                var apartmentList = contracts.Skip((filter.Page - 1) * filter.Limit).Take(filter.Limit)
                    .Select(p => new ApartmentModel()
                    {
                        Id = p.apartment.apartment_id,
                        Code = p.apartment.code,
                        Building = p.building,
                        NoApartment = p.no_apartment,
                        Address = p.address
                    }).ToList();
                return new PagingResult<ApartmentModel>()
                {
                    data = apartmentList,
                    total = contracts.Count
                };
            }
            return new PagingResult<ApartmentModel>();
        }
    }
}
