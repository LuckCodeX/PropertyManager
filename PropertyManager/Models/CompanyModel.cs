using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class CompanyModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeePhone { get; set; }
        public string Email { get; set; }
        public int? Type { get; set; }
        public int InteractiveCounter { get; set; }
        public string TaxCode { get; set; }
        public string BankName { get; set; }
        public string BankAccount { get; set; }
        public string BankBranch { get; set; }
        public string BankNumber { get; set; }
        public int? CallDate { get; set; }
        public int? CallAgainDate { get; set; }
        public int? AdminId { get; set; }
    }
}