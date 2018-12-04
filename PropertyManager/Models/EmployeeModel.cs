using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class EmployeeModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public int Role { get; set; }
        public string RoleName { get; set; }
        public string Phone { get; set; }
        public string Birthday { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Type { get; set; }
        public string Code { get; set; }
        public StatisticModel Statistic { get; set; }
    }
}