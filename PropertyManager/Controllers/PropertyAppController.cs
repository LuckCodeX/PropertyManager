using System.Collections.Generic;
using System.Linq;
using System.Net;
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
            if (Equals(employee, null))
                ExceptionContent(HttpStatusCode.Unauthorized, "Tài khoản hoặc mật khẩu sai");
            var token = new TokenModel
            {
                Id = employee.employee_id,
                Username = employee.username,
                Role = employee.role
            };
            return new EmployeeModel
            {
                Username = employee.username,
                Token = Encrypt.Base64Encode(JsonConvert.SerializeObject(token)),
                Role = employee.role,
                Birthday = employee.birthday,
                FirstName = employee.first_name,
                LastName = employee.last_name,
                Phone = employee.phone,
                Code = employee.code,
                Statistic = new StatisticModel
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
            return issues.Select(p => new IssueModel
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
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var apartment = _service.GetApartmentByCode(model.ApartmentCode);
                if (Equals(apartment, null))
                    ExceptionContent(HttpStatusCode.InternalServerError, "Không tìm thấy thông tin căn hộ");

                var contract = _service.GetCurrentParentContractByApartmentId(apartment.apartment_id);
                if (Equals(contract, null))
                    ExceptionContent(HttpStatusCode.InternalServerError, "Căn hộ đã hết hạn hợp đồng");

                var contractEmployee =
                    _service.GetContractEmployeeByContractIdAndEmployeeId(contract.contract_id, maid.employee_id);
                if (Equals(contractEmployee, null) || contractEmployee.status != 1 || !Equals(contractEmployee.to_date, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Bạn không có quyền vào căn hộ này");

                var apartmentEmployee =
                    _service.GetLastApartmentEmployeeNotCheckOutByEmployeeId(maid.employee_id);
                if (!Equals(apartmentEmployee, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Bạn có 1 căn hộ chưa hoàn thành");

                apartmentEmployee = new apartment_employee
                {
                    apartment_employee_id = 0,
                    check_in_time = ConvertDatetime.GetCurrentUnixTimeStamp(),
                    check_in_geo = JsonConvert.SerializeObject(model.CheckInGeo),
                    contract_id = contract.contract_id,
                    employee_id = maid.employee_id
                };
                _service.SaveApartmentEmployee(apartmentEmployee);

                return new ApartmentModel
                {
                    Id = apartment.apartment_id,
                    Address = contract.address,
                    Building = contract.building,
                    NoApartment = contract.no_apartment,
                    Project = !Equals(apartment.apartment_id, null) ? new ProjectModel
                    {
                        Name = apartment.project.project_content.FirstOrDefault(p => p.language == 0).name
                    } : new ProjectModel(),
                    Resident = new UserProfileModel
                    {
                        FullName = contract.resident_name,
                        Phone = contract.resident_phone,
                        Id = contract.user_profile1.user_profile_id,
                        NoteList = contract.user_profile1.user_profile_note.Select(p => new UserProfileNoteModel
                        {
                            Id = p.user_profile_note_id,
                            CreatedDate = p.created_date,
                            Note = p.note
                        }).ToList()
                    },
                    PassWifi = contract.pass_wifi,
                    WifiName = contract.wifi_name,
                    PassDoor = contract.pass_door,
                    WorkHour = contractEmployee.work_hour,
                    WorkDate = contractEmployee.work_date.Split(',').ToList(),
                    Maid = new EmployeeModel
                    {
                        FirstName = maid.first_name,
                        LastName = maid.last_name
                    },
                    Area = contract.area,
                    NoBedRoom = contract.no_bedroom
                };
            }
            return new ApartmentModel();
        }

        [HttpPost]
        [Route("MaidTrackingIssue")]
        public void MaidTrackingIssue(ApartmentEmployeeModel model)
        {
            if (Request.Headers.TryGetValues("Token", out var values))
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
                apartmentEmployee.type = model.Type;
                _service.SaveApartmentEmployee(apartmentEmployee);

                var listIssue = new List<apartment_employee_issue>();
                foreach (var item in model.ListIssue)
                {
                    var issue = new apartment_employee_issue
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
            if (Request.Headers.TryGetValues("Token", out var values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var problem = new problem
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
                    var img = new problem_image
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
        public List<ApartmentModel> MaidGetListApartment()
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var contracts = _service.GetAllCurrentContractByEmployeeId(maid.employee_id);
                var apartmentList = contracts.Select(p => new ApartmentModel
                {
                    Id = p.apartment.apartment_id,
                    Code = p.apartment.code,
                    Building = p.building,
                    NoApartment = p.no_apartment,
                    Project = Equals(p.apartment.project_id, null) ? new ProjectModel() : new ProjectModel
                    {
                        Name = p.apartment.project.project_content.FirstOrDefault(q => q.language == 0).name
                    },
                    Address = p.address
                }).ToList();
                return apartmentList;
            }
            return new List<ApartmentModel>();
        }

        [HttpGet]
        [Route("MaidGetApartmentDetail/{apartmentId}")]
        public ApartmentModel MaidGetApartmentDetail(int apartmentId)
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var contract = _service.GetCurrentContractByApartmentAndEmployeeId(apartmentId, maid.employee_id);
                var contractEmployee =
                    _service.GetContractEmployeeByContractIdAndEmployeeId(contract.contract_id, maid.employee_id);
                return new ApartmentModel
                {
                    Id = contract.apartment.apartment_id,
                    Code = contract.apartment.code,
                    Address = contract.address,
                    Building = contract.building,
                    NoApartment = contract.no_apartment,
                    Project = !Equals(contract.apartment.project_id, null) ? new ProjectModel
                    {
                        Name = contract.apartment.project.project_content.FirstOrDefault(p => p.language == 0).name
                    } : new ProjectModel(),
                    PassDoor = contract.pass_door,
                    PassWifi = contract.pass_wifi,
                    WifiName = contract.wifi_name,
                    WorkHour = contractEmployee.work_hour,
                    WorkDate = contractEmployee.work_date.Split(',').ToList(),
                    Resident = new UserProfileModel
                    {
                        FullName = contract.resident_name,
                        Phone = contract.resident_phone,
                        Id = contract.user_profile1.user_profile_id,
                        NoteList = contract.user_profile1.user_profile_note.Select(p => new UserProfileNoteModel
                        {
                            Id = p.user_profile_note_id,
                            CreatedDate = p.created_date,
                            Note = p.note
                        }).ToList()
                    },
                    Maid = new EmployeeModel
                    {
                        FirstName = maid.first_name,
                        LastName = maid.last_name
                    },
                    ProblemList = contract.apartment.problems.Where(p => p.type == (int)ProblemType.Maid).Select(p => new ProblemModel
                    {
                        Id = p.problem_id,
                        CreatedDate = p.created_date,
                        Summary = p.summary,
                        Description = p.summary,
                        Status = p.status,
                        ListImage = p.problem_image.Select(q => new ProblemImageModel
                        {
                            Id = q.problem_image_id,
                            Img = q.img
                        }).ToList()
                    }).ToList()
                };
            }
            return new ApartmentModel();
        }

        [HttpGet]
        [Route("MaidGetListTimeSheet")]
        public List<TimeSheetModel> MaidGetListTimeSheet()
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");


            }
            return new List<TimeSheetModel>();
        }

        [HttpPost]
        [Route("ChangePassword")]
        public void ChangePassword(EmployeeModel model)
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var oldPass = Encrypt.EncodePassword(model.OldPassword);
                if (!Equals(oldPass, maid.password))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Mật khẩu cũ không đúng");
                var newPass = Encrypt.EncodePassword(model.Password);
                maid.password = newPass;
                _service.SaveEmployee(maid);
            }
        }

        [HttpGet]
        [Route("GetMaidCalendar/{minTime}/{maxTime}")]
        public List<CalendarModel> GetMaidCalendar(int minTime, int maxTime)
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");
                var x = 60 * 60 * 24;
                var result = new List<CalendarModel>();
                var contractEmployees = _service.GetAllCurrentContractEmployeeByEmployeeId(maid.employee_id);
                while (minTime < maxTime)
                {
                    var max = minTime + x;
                    var dow = (int)ConvertDatetime.UnixTimeStampToDateTime(minTime).DayOfWeek;
                    var apartmentList = new List<ApartmentModel>();
                    foreach (var item in contractEmployees)
                    {
                        var days = item.work_date.Split(',').ToList();
                        if (days.IndexOf(dow.ToString()) != -1)
                        {
                            var apartment = new ApartmentModel
                            {
                                Id = item.contract.apartment.apartment_id,
                                Code = item.contract.apartment.code,
                                NoBedRoom = item.contract.no_bedroom,
                                WorkHour = item.work_hour,
                                Address = item.contract.address,
                                NoApartment = item.contract.no_apartment,
                                Building = item.contract.building,
                                Project = !Equals(item.contract.apartment.project_id, null) ? new ProjectModel
                                {
                                    Name = item.contract.apartment.project.project_content.FirstOrDefault(p => p.language == 0).name
                                } : new ProjectModel()
                            };
                            apartmentList.Add(apartment);
                        }
                    }
                    var calendar = new CalendarModel
                    {
                        ApartmentList = apartmentList,
                        Time = minTime
                    };
                    result.Add(calendar);
                    minTime = max;
                }

                return result;
            }
            return new List<CalendarModel>();
        }

        [HttpGet]
        [Route("GetMaidTotalTimeSheet")]
        public List<CalendarModel> GetMaidTotalTimeSheet()
        {
            IEnumerable<string> values;
            if (Request.Headers.TryGetValues("Token", out values))
            {
                var token = values.First();
                var tokenModel = JsonConvert.DeserializeObject<TokenModel>(Encrypt.Base64Decode(token));
                var maid = _service.GetActiveMaidById(tokenModel.Id);
                if (Equals(maid, null))
                    ExceptionContent(HttpStatusCode.Unauthorized, "Không tìm thấy thông tin tài khoản");

                var startTime = ConvertDatetime.GetBeginMonthUnixTimeStampByTimestamp(maid.created_date);
                var endCurrentTime = ConvertDatetime.GetEndMonthUnixTimeStamp();
                var result = new List<CalendarModel>();
                while (startTime < endCurrentTime)
                {
                    var endTime = ConvertDatetime.GetEndMonthUnixTimeStampByTimestamp(startTime);
                    var apartmentEmployees =
                        _service.GetListApartmentEmployeeByEmployeeIdAndTimeStamp(maid.employee_id, startTime, endTime).Select(p => new ApartmentEmployeeModel()
                        {
                            Id = p.apartment_employee_id,
                            CheckInTime = p.check_in_time ?? 0,
                            CheckOutTime = p.check_out_time ?? 0,
                            Type = p.type,
                            Apartment = new ApartmentModel()
                            {
                                Id = p.contract.apartment_id.Value,
                                Code = p.contract.apartment.code,
                                NoBedRoom = p.contract.no_bedroom
                            }
                        }).ToList();
                    var calendar = new CalendarModel()
                    {
                        Time = startTime,
                        ApartmentEmployeeList = apartmentEmployees
                    };
                    result.Add(calendar);

                    startTime = endTime + 1;
                }

                return result;
            }
            return new List<CalendarModel>();
        }

        [HttpGet]
        [Route("GetAllMaidInbox")]
        public List<InboxModel> GetAllMaidInbox()
        {
            return _service.GetAllInboxByType(0).Select(p => new InboxModel()
            {
                Id = p.inbox_id,
                CreatedDate = p.created_date,
                Type = p.type,
                Content = p.content
            }).ToList();
        }

        protected override void Dispose(bool disposing)
        {
            _service.Dispose();
            base.Dispose(disposing);
        }
    }
}
