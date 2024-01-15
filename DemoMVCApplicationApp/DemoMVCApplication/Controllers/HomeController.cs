using DemoMVCApplication.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace DemoMVCApplication.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var PersonOne = new Employee()
            {
               Id = 1,
               Name = "Foo",
               Address = "Test Address" 
            };
            return View(PersonOne);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}