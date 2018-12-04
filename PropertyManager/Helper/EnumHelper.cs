using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PropertyManager.Helper
{
    public enum RoleAdmin
    {
        AdminWeb,
        SuperAdmin,
        ApartmentManager,
        CustomerManager,
        ApartmentEmployee,
        CustomerEmployee,
        MaidManager
    }

    public enum RoleEmployee
    {
        MaidManager,
        Maid
    }
}