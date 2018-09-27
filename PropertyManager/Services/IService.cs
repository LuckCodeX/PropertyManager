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
    }
}
