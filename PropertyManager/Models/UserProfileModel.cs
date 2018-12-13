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
        public string Identification { get; set; }
    }
}