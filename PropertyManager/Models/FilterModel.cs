using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class FilterModel
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int Id { get; set; }
        public int? FromDate { get; set; }
        public int? ToDate { get; set; }
        public string Search { get; set; }
    }
}