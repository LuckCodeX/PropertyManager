using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Models
{
    public class ContractModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int Type { get; set; }
        public int? CompanyId { get; set; }
        public CompanyModel Company { get; set; }
        public int? UserProfileId { get; set; }
        public UserProfileModel UserProfile { get; set; }
        public int? OwnerUserProfileId { get; set; }
        public UserProfileModel OwnerUserProfile { get; set; }
        public int? CreatedDate { get; set; }
        public int? ApartmentId { get; set; }
        public ApartmentModel Apartment { get; set; }
        public string Building { get; set; }
        public string NoApartment { get; set; }
        public string Address { get; set; }
        public decimal? Area { get; set; }
        public int? NoBedRoom { get; set; }
        public string PassWifi { get; set; }
        public string PassDoor { get; set; }
        public string OwnerName { get; set; }
        public string OwnerPhone { get; set; }
        public string OwnerTaxCode { get; set; }
        public string OwnerAddress { get; set; }
        public string OwnerBankAccount { get; set; }
        public string OwnerBankName { get; set; }
        public string OwnerBankNumber { get; set; }
        public string OwnerBankBranch { get; set; }
        public string TenantName { get; set; }
        public string TenantPhone { get; set; }
        public string TenantTaxCode { get; set; }
        public string TenantAddress { get; set; }
        public string TenantBankAccount { get; set; }
        public string TenantBankName { get; set; }
        public string TenantBankNumber { get; set; }
        public string TenantBankBranch { get; set; }
        public string ResidentName { get; set; }
        public string ResidentPhone { get; set; }
        public int? StartDate { get; set; }
        public int? EndDate { get; set; }
        public int? AdminId { get; set; }
        public AdminModel Admin { get; set; }
        public int? ParentId { get; set; }
        public EmployeeModel Maid { get; set; }
    }
}