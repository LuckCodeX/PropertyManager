using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class InboxModel
    {
        public int Id { get; set; }
        public int CreatedDate { get; set; }
        public string Content { get; set; }
        public int Type { get; set; }
    }
}