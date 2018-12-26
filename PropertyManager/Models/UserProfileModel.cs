using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class UserProfileModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public string Avatar { get; set; }
        public string Avatar_Base64 { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Identification { get; set; }
        public string TaxCode { get; set; }
        public string BankAccount { get; set; }
        public string BankName { get; set; }
        public string BankNumber { get; set; }
        public string BankBranch { get; set; }
        public List<UserProfileNoteModel> NoteList { get; set; }
    }

    public class UserProfileNoteModel
    {
        public int Id { get; set; }
        public int CreatedDate { get; set; }
        public string Note { get; set; }
        public int UserProfileId { get; set; }
    }
}