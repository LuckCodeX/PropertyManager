using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class ApartmentEmployeeModel
    {
        public int Id { get; set; }
        public int ApartmentId { get; set; }
        public ApartmentModel Apartment { get; set; }
        public string ApartmentCode { get; set; }
        public int CheckInTime { get; set; }
        public int CheckOutTime { get; set; }
        public ApartmentGeo CheckInGeo { get; set; }
        public ApartmentGeo CheckOutGeo { get; set; }
        public List<ApartmentEmployeeIssueModel> ListIssue { get; set; }
    }

    public class ApartmentEmployeeIssueModel
    {
        public int Id { get; set; }
        public int IssueId { get; set; }
        public bool IsComplete { get; set; }
    }

    public class ApartmentGeo
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}