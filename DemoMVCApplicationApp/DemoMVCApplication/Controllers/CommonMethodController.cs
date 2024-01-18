using DemoMVCApplication.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace PJ_Buyer_Portal.Controllers
{
    public class CommonMethodController : Controller
    {
        public static bool checkMenuURL(string userType, string userID, string menuID)
        {
            try
            {
                using (Three_Sixty_RotationEntities dbntt = new Three_Sixty_RotationEntities())
                {
                    var chkControl = (from ua in dbntt.UserAuthentications
                                      where ua.UserID == userID && ua.MenuID == menuID && ua.bShow == true
                                      select ua).ToList();
                    return (chkControl.Count() > 0 ? true : false);
                }
            }
            catch (Exception exp)
            {
                return false;
            }
        }
    }
}