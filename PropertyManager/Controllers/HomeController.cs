using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PropertyManager.Models;

namespace PropertyManager.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult Account()
        {
            return View();
        }

        public ActionResult AccountDetail()
        {
            return View();
        }

        public ActionResult Apartment()
        {
            return View();
        }

        public ActionResult ApartmentDetail()
        {
            return View();
        }

        public ActionResult ImportApartment()
        {
            return View();
        }

        public ActionResult ImportCustomer()
        {
            return View();
        }

        public ActionResult CustomerList()
        {
            return View();
        }

        public ActionResult ApartmentList()
        {
            return View();
        }

        public ActionResult Contract()
        {
            return View();
        }

        public ActionResult ContractDetail()
        {
            return View();
        }
    }
}
