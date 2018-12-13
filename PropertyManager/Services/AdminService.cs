using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PropertyManager.Helper;
using PropertyManager.Models;

namespace PropertyManager.Services
{
    public partial class Service
    {
        private GenericRepository<admin> _adminRepository;
        public GenericRepository<admin> AdminRepository
        {
            get
            {
                if (this._adminRepository == null)
                    this._adminRepository = new GenericRepository<admin>(_context);
                return _adminRepository;
            }
        }

        public admin GetAdminByToken(TokenModel token)
        {
            return AdminRepository.FindBy(p => p.admin_id == token.Id && p.username == token.Username && p.status == 1 && p.role != (int)RoleAdmin.AdminWeb).FirstOrDefault();
        }

        public admin LoginAdmin(AdminModel model)
        {
            var pass = Encrypt.EncodePassword(model.Password);
            return AdminRepository.FindBy(p => p.username == model.Username && p.password == pass && p.role != (int)RoleAdmin.AdminWeb && p.status == 1).FirstOrDefault();
        }

        public List<admin> SuperAdminGetListAdmin(string search)
        {
            return AdminRepository
                .FindBy(p => p.status == 1 && p.role != (int)RoleAdmin.SuperAdmin && (Equals(search, null) || p.username.Contains(search))).ToList();
        }

        public List<admin> GetListAdminByParentId(string search, int id)
        {
            return AdminRepository.FindBy(p =>
                p.status == 1 && p.role != (int)RoleAdmin.AdminWeb && p.role != (int)RoleAdmin.SuperAdmin && p.parent_id == id &&
                (Equals(search, null) || p.username.Contains(search))).ToList();
        }

        public string GetRoleName(int role)
        {
            switch (role)
            {
                case (int)RoleAdmin.SuperAdmin:
                    return "Admin tổng";
                case (int)RoleAdmin.AdminWeb:
                    return "Admin website";
                case (int)RoleAdmin.ApartmentEmployee:
                    return "Nhân viên nhóm căn hộ";
                case (int)RoleAdmin.ApartmentManager:
                    return "Quản lý nhóm căn hộ";
                case (int)RoleAdmin.CustomerEmployee:
                    return "Nhân viên nhóm khách hàng";
                case (int)RoleAdmin.CustomerManager:
                    return "Quản lý nhóm khách hàng";
                default:
                    return null;
            }
            
        }

        public admin GetAdminById(int id)
        {
            return AdminRepository.FindBy(p => p.admin_id == id && p.status == 1).FirstOrDefault();
        }

        public List<admin> GetListLeader()
        {
            return AdminRepository.FindBy(p => Equals(p.parent_id, null) && p.status == 1 && p.role != (int)RoleAdmin.AdminWeb && p.role != (int)RoleAdmin.SuperAdmin).ToList();
        }

        public void SaveAdmin(admin acc)
        {
            AdminRepository.Save(acc);
        }

        public List<admin> GetAllSaleAccount()
        {
            return AdminRepository.FindBy(p =>
                p.status == 1 && (p.role == (int) RoleAdmin.CustomerEmployee ||
                                  p.role == (int) RoleAdmin.CustomerManager)).ToList();
        }
    }
}