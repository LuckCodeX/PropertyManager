using System;
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
    }
}
