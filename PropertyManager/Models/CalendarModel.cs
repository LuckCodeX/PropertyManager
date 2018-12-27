using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class CalendarModel
    {
        public int Time { get; set; }
        public List<ApartmentModel> ApartmentList { get; set; }
        public List<ApartmentEmployeeModel> ApartmentEmployeeList { get; set; }
    }
}