using DemoMVCApplication.Models;
using PJ_Buyer_Portal.Controllers;
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
            //var PersonOne = new Employee()
            //{
            //   Id = 1,
            //   Name = "Foo",
            //   Address = "Test Address" 
            //};
            //return View(PersonOne);

            if (Session["logUser"] != null)
            {
                if (CommonMethodController.checkMenuURL(Session["UserType"].ToString(), Session["logUserID"].ToString(), "M-1")
                    || (Session["UserType"].ToString() == "UT-01" || Session["UserType"].ToString() == "UT-02" || Session["UserType"].ToString() == "UT-04"))
                {
                    Session["SideMenuChecked"] = 0;
                    return View();
                }
            }
            return RedirectToAction("UserLogin", "User");


        }

        public ActionResult JqueryTable()
        {
            return View();
        }

        //public ActionResult GetList()
        //{
            
        //}

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