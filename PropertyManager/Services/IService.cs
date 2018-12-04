﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    interface IService
    {
        admin GetAdminByToken(TokenModel token);
        admin LoginAdmin(AdminModel model);
        List<admin> SuperAdminGetListAdmin(string search);
        List<admin> GetListAdminByParentId(string search, int id);
        string GetRoleName(int role);
        admin GetAdminById(int id);
        List<admin> GetListLeader();
        void SaveAdmin(admin acc);
        List<apartment> GetListApartment(int status, string search);
        apartment GetApartmentById(int id);
        FacilityContentModel ConvertFacilityContentToModel(facility_content model);
        List<ApartmentContentModel> GetApartmentContentList(ICollection<apartment_content> apartmentApartmentContent);
        void SaveApartment(apartment apartment);
        void Dispose();
        string SaveImage(string path, string imageName, string image);
        void SaveApartmentImage(aparment_image img);
        void DeleteApartmentImage(aparment_image item);
        void SaveApartmentFacility(apartment_facility aptFac);
        void DeleteApartmentFacility(apartment_facility item);
        apartment_content GetApartmentContentById(int id);
        void SaveApartmentContent(apartment_content content);
        List<facility> GetAllFacilities();
        project GetProjectByName(string name);
        void SaveProject(project project);
        void SaveProjectContent(project_content content);
        user_profile GetUserProfileByNameAndPhone(string name, string phone);
        void SaveUserProfile(user_profile userProfile);
        void SaveListApartment(List<apartment> lst);
        List<user_visit> SearchListUserVisit(int status);
        user_visit GetUserVisitById(int id);
        void DeleteUserVisit(user_visit userVisit);
        user_profile GetUserProfileById(int userProfileId);
        user_visit_item GetUserVisitItemById(int id);
        void SaveUserVisit(user_visit visit);
        void SaveUserVisitItem(user_visit_item visitItem);
        user_visit_history GetUserVisitHistoryById(int id);
        void SaveUserVisitHistory(user_visit_history his);
        employee GetEmployeeById(int id);
        void SaveEmployee(employee employee);
        List<employee> SearchListActiveMaid(FilterModel filter);
        string GetEmployeeRoleName(int role);
    }
}
