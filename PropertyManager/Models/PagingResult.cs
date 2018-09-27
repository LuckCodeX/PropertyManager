using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class PagingResult<T>
    {
        public int total { get; set; }
        public List<T> data { get; set; }
    }
}