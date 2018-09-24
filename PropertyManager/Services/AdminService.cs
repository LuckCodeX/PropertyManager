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
            return AdminRepository.FindBy(p => p.admin_id == token.Id && p.username == token.Username).FirstOrDefault();
        }

        public admin LoginAdmin(AdminModel model)
        {
            var pass = Encrypt.EncodePassword(model.Password);
            return AdminRepository.FindBy(p => p.username == model.Username && p.password == pass && p.role != 0).FirstOrDefault();
        }
    }
}