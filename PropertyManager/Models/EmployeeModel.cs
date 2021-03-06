﻿using System;
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
        public string OldPassword { get; set; }
        public string UDID { get; set; }
        public string DeviceToken { get; set; }
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
        public List<string> WorkDate { get; set; }
        public int? WorkHour { get; set; }
        public List<EmployeeNoteModel> NoteList { get; set; }
    }

    public class EmployeeNoteModel
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int CreatedDate { get; set; }
        public string Note { get; set; }
    }

    public class TimeSheetModel
    {
        public int Id { get; set; }
        public int Total { get; set; }
        public int StartDate { get; set; }
    }

    public class ContractEmployeeModel
    {
        public int Id { get; set; }
        public int FromDate { get; set; }
        public int ToDate { get; set; }
        public int WorkHour { get; set; }
        public List<string> WorkDate { get; set; }
    }
}