using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace PropertyManager
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Login",
                url: "login",
                defaults: new { controller = "Home", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Dashboard",
                url: "dashboard",
                defaults: new { controller = "Home", action = "Dashboard", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Apartment",
                url: "apartment",
                defaults: new { controller = "Home", action = "Apartment", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ApartmentDetail",
                url: "apartment-detail/{id}",
                defaults: new { controller = "Home", action = "ApartmentDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Account",
                url: "system/account",
                defaults: new { controller = "Home", action = "Account", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "AccountDetail",
                url: "system/account-detail/{id}",
                defaults: new { controller = "Home", action = "AccountDetail", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ImportCustomer",
                url: "system/import-customer",
                defaults: new { controller = "Home", action = "ImportCustomer", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "ImportApartment",
                url: "system/import-apartment",
                defaults: new { controller = "Home", action = "ImportApartment", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
