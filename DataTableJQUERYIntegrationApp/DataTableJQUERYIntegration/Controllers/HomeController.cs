using DataTableJQUERYIntegration.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DataTableJQUERYIntegration.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetList()
        {
            using (Practice_DB_OwnEntities dc = new Practice_DB_OwnEntities())
            {
                var dataFromTable = dc.Employees.ToList<Employee>();
                //object data = new object();
                return Json (new { dataFromTable }, JsonRequestBehavior.AllowGet);
            }
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