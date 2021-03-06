﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class ApartmentModel
    {
        public int Id { get; set; }
        public int UserProfileOwnerId { get; set; }
        public UserProfileModel UserProfileOwner { get; set; }
        public int Status { get; set; }
        public string Code { get; set; }
        public decimal? Price { get; set; }
        public decimal? ManagementFee { get; set; }
        public decimal? Area { get; set; }
        public int? NoBedRoom { get; set; }
        public int? NoBathRoom { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public int? ProjectId { get; set; }
        public string NoApartment { get; set; }
        public string Building { get; set; }
        public string WifiName { get; set; }
        public string PassWifi { get; set; }
        public string PassDoor { get; set; }
        public ProjectModel Project { get; set; }
        public int Type { get; set; }
        public List<string> WorkDate { get; set; }
        public int? WorkHour { get; set; }
        public ApartmentContentModel Content { get; set; }
        public List<ApartmentContentModel> ContentList { get; set; }
        public List<ApartmentImageModel> ImgList { get; set; }
        public List<FacilityModel> FacilityList { get; set; }
        public UserProfileModel Resident { get; set; }
        public EmployeeModel Maid { get; set; }
        public List<ProblemModel> ProblemList { get; set; }
        public ContractEmployeeModel ContractEmployee { get; set; }
        public ApartmentEmployeeModel ApartmentEmployee { get; set; }
    }

    public class ApartmentContentModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Language { get; set; }
    }

    public class ApartmentImageModel
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public string Img { get; set; }
        public string Img_Base64 { get; set; }
    }
}