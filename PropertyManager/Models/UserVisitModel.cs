using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class UserVisitModel
    {
        public int Id { get; set; }
        public int CreatedAt { get; set; }
        public int Status { get; set; }
        public List<UserVisitItemModel> Items { get; set; }
        public int TotalItems { get; set; }
        public UserProfileModel UserProfile { get; set; }
    }

    public class UserVisitItemModel
    {
        public int Id { get; set; }
        public int ApartmentId { get; set; }
        public bool IsApartmentFee { get; set; }
        public bool IsInternetWifi { get; set; }
        public int TvType { get; set; }
        public int Cleaning { get; set; }
        public int Water { get; set; }
        public bool IsDetergent { get; set; }
        public decimal Bill { get; set; }
        public bool IsIncludeTax { get; set; }
        public decimal ServicePrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int Status { get; set; }
        public ApartmentModel Apartment { get; set; }
        public List<UserVisitHistoryModel> Histories { get; set; }
    }

    public class UserVisitHistoryModel
    {
        public int Id { get; set; }
        public int ExpectedDate { get; set; }
        public int ActualDate { get; set; }
    }
}