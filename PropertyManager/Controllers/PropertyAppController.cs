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
    }
}
