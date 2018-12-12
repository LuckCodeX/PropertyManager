using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class AdminModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public int Role { get; set; }
        public string RoleName { get; set; }
        public int? ParentId { get; set; }
        public AdminModel Parent { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string BankAccount { get; set; }
        public string BankName { get; set; }
        public string BankNumber { get; set; }
        public string BankBranch { get; set; }
    }
}