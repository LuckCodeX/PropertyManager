﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class ProblemModel
    {
        public int Id { get; set; }
        public int ApartmentId { get; set; }
        public int ContractId { get; set; }
        public int? IssueId { get; set; }
        public IssueModel Issue { get; set; }
        public int? Type { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public int? Priority { get; set; }
        public int Status { get; set; }
        public int CreatedDate { get; set; }
        public List<ProblemImageModel> ListImage { get; set; }
        public ApartmentModel Apartment { get; set; }
        public List<ProblemTrackingModel> TrackingList { get; set; }
    }

    public class ProblemImageModel
    {
        public int Id { get; set; }
        public int ProblemId { get; set; }
        public string Img { get; set; }
        public string Img_Base64 { get; set; }
    }

    public class ProblemTrackingModel
    {
        public int Id { get; set; }
        public int ProblemId { get; set; }
        public int CreatedDate { get; set; }
        public string Content { get; set; }
        public decimal? Price { get; set; }
        public int? EmployeeId { get; set; }
    }
}