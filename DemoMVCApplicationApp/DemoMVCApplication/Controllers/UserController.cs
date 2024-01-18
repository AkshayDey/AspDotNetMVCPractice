using DemoMVCApplication.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DemoMVCApplication.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult UserLogin()
        {
            try
            {
                using (Three_Sixty_RotationEntities dbEntity = new Three_Sixty_RotationEntities())
                {
                    if (Session["logUser"] != null)
                    {
                        string user = Session["logUser"].ToString();
                        LoginSummary userTrack = dbEntity.LoginSummaries.Where(val => val.UserID == user).OrderByDescending(val => val.LoginTime).FirstOrDefault();
                        userTrack.LogoutTime = DateTime.Now;

                        dbEntity.LoginSummaries.Add(userTrack);
                        dbEntity.Entry(userTrack).State = EntityState.Modified;
                        dbEntity.SaveChanges();
                    }
                }
            }
            catch (Exception Exp)
            {

            }
            Session.Clear();
            Session.Abandon();
            Session.RemoveAll();
            return View("Login");
        }

        [HttpPost]
        public JsonResult UserLogin(LoginModel login)
        {
            try
            {
                if (CheckUserBlock(login.Username))
                {
                    using (Three_Sixty_RotationEntities dbEntity = new Three_Sixty_RotationEntities())
                    {
                        if (login.Password.Trim().Length != 0)
                        {
                            var pass = PasswordEncoding(login.Password);
                            UserRegister userRegister = dbEntity.UserRegisters.Where(val => val.Username == login.Username && val.Password == pass && val.Active == true).FirstOrDefault();
                            if (userRegister.Username != null)
                            {
                                Session["logUserID"] = userRegister.UserID;
                                Session["logUser"] = login.Username;
                                Session["UserType"] = userRegister.UserTypeID;
                                Session["logIP"] = Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? Request.ServerVariables["REMOTE_ADDR"];

                                LoginSummary logSumm = new LoginSummary();
                                logSumm.UserID = userRegister.Username;
                                logSumm.UserIP = Session["logIP"].ToString();
                                logSumm.LoginTime = DateTime.Now;

                                dbEntity.LoginSummaries.Add(logSumm);
                                dbEntity.SaveChanges();

                                Session["SideMenuChecked"] = 1;
                                if (userRegister.UserTypeID == "UT-04")
                                {
                                    Session["Buyer_Name"] = userRegister.BuyerID;
                                    var Log_Check = dbEntity.LogChecks.Where(log => log.LogCheck1 >= DateTime.Now && log.UserID == userRegister.UserID).Count();

                                    if (Log_Check > 0)
                                    {
                                        var menuNames = dbEntity.MenuNames.Where(mn => mn.Status == true && mn.MenuID == "M-1").OrderBy(dl => dl.OrderBy).ToList(); ;
                                        Session["MenuList"] = menuNames;

                                        foreach (var mn in menuNames)
                                        {
                                            Session[mn.MenuName1 + " Edit"] = 0;
                                            Session[mn.MenuName1 + " Delete"] = 0;
                                        }

                                        return new JsonResult { Data = new { userType = userRegister.UserTypeID, logCheck = Log_Check, CountData = userRegister, type = "error" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                                    }
                                    else
                                        return new JsonResult { Data = new { logCheck = Log_Check, message = "Login failed. Communicate with System Administrator.", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                                }
                                else
                                {
                                    if (userRegister.UserTypeID == "UT-03")
                                    {
                                        var menuNames = (from mn in dbEntity.MenuNames
                                                         where (from ua in dbEntity.UserAuthentications
                                                                where ua.UserName == login.Username && ua.bShow == true
                                                                select ua.MenuID).Contains(mn.MenuID)
                                                         where mn.Status == true
                                                         select mn).OrderBy(dl => dl.OrderBy).ToList();

                                        Session["MenuList"] = menuNames;

                                        var listUserAccess = (from ua in dbEntity.UserAuthentications
                                                              join mn in dbEntity.MenuNames on ua.MenuID equals mn.MenuID
                                                              where ua.UserName == login.Username && mn.Status == true && ua.bShow == true
                                                              select new
                                                              {
                                                                  MenuID = mn.MenuID,
                                                                  MenuName = mn.MenuName1,
                                                                  MainMenuID = mn.MainMenuID,
                                                                  MenuLayer = mn.MenuLayer,
                                                                  MenuControl = mn.MenuControl,
                                                                  Status = mn.Status,
                                                                  CSSClass = mn.CSSClass,
                                                                  OrderBy = mn.OrderBy,
                                                                  bEdit = ua.bEdit,
                                                                  bDelete = ua.bDelete
                                                              }).OrderBy(dl => dl.OrderBy).ToList();

                                        if (listUserAccess.Count() > 0)
                                        {
                                            foreach (var ua in listUserAccess)
                                            {
                                                Session[ua.MenuName + " Edit"] = (ua.bEdit == true ? 1 : 0);
                                                Session[ua.MenuName + " Delete"] = (ua.bDelete == true ? 1 : 0);
                                            }
                                        }
                                        else
                                        {
                                            var lstMenuName = dbEntity.MenuNames.Where(mn => mn.Status == true).OrderBy(dl => dl.OrderBy).ToList();
                                            Session["MenuList"] = menuNames;

                                            foreach (var mn in menuNames)
                                            {
                                                Session[mn.MenuName1 + " Edit"] = 0;
                                                Session[mn.MenuName1 + " Delete"] = 0;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var menuNames = dbEntity.MenuNames.Where(mn => mn.Status == true).OrderBy(dl => dl.OrderBy).ToList();
                                        Session["MenuList"] = menuNames;

                                        foreach (var mn in menuNames)
                                        {
                                            Session[mn.MenuName1 + " Edit"] = 1;
                                            Session[mn.MenuName1 + " Delete"] = 1;
                                        }
                                    }
                                    return new JsonResult { Data = new { userType = userRegister.UserTypeID, logCheck = 1, CountData = userRegister, type = "error" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                                }
                            }
                            else
                            {
                                EntryUserBlockInfo(login.Username);
                                return new JsonResult { Data = new { message = "Provide valid password", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                            }
                        }
                        else
                        {
                            EntryUserBlockInfo(login.Username);
                            return new JsonResult { Data = new { message = "User is not registered", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                        }
                    }
                }
                else
                {
                    EntryUserBlockInfo(login.Username);
                    return new JsonResult { Data = new { userValidity = false, message = "Contact with system administrator", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
            }
            catch (Exception Exp)
            {
                EntryUserBlockInfo(login.Username);
                return new JsonResult { Data = new { message = Exp.ToString(), type = "error" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }



        //-----------------------------------------------User Registration Start------------------------------------//

        //--------------------------------------------------User Login Start----------------------------------------//
        [HttpPost]
        public bool CheckUserBlock(string UserName)
        {
            try
            {
                using (Three_Sixty_RotationEntities dbEntity = new Three_Sixty_RotationEntities())
                {
                    var chkBlockUser = dbEntity.UnauthorizedUserBlockInfoes.Where(val => val.UserName == UserName && SqlFunctions.DateDiff("SS", SqlFunctions.DateAdd("MI", val.BlockTime, val.Date), DateTime.Now) < 0).Count();
                    if (chkBlockUser == 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception Exp)
            {
                return false;
            }
        }


        //--------------------------------------------------Password Encoding---------------------------------------------------//
        public string PasswordEncoding(string pass)
        {
            char[] passArray = pass.ToCharArray();
            Array.Reverse(passArray);
            int Pass_value = 0;
            for (int i = 0; i < passArray.Length; i++)
            {
                if (Convert.ToInt16(passArray[i]) <= 60)
                    Pass_value = Convert.ToInt16(passArray[i]) + (i + 1);
                else
                    Pass_value = Convert.ToInt16(passArray[i]);

                if (i % 2 == 0)
                {
                    if (Convert.ToInt16(passArray[i]) >= 65 && Convert.ToInt16(passArray[i]) <= 90)
                    {
                        Pass_value = Pass_value + 10;
                    }
                    else if (Convert.ToInt16(passArray[i]) >= 97 && Convert.ToInt16(passArray[i]) <= 122)
                    {
                        Pass_value = Pass_value - 15;
                    }
                    else if (Convert.ToInt16(passArray[i]) >= 48 && Convert.ToInt16(passArray[i]) <= 57)
                    {
                        Pass_value = Pass_value - 3;
                    }
                }

                if (i % 2 == 1)
                {
                    if (Convert.ToInt16(passArray[i]) >= 65 && Convert.ToInt16(passArray[i]) <= 90)
                    {
                        Pass_value = Pass_value + 21;
                    }
                    else if (Convert.ToInt16(passArray[i]) >= 97 && Convert.ToInt16(passArray[i]) <= 122)
                    {
                        Pass_value = Pass_value - 26;
                    }
                    else if (Convert.ToInt16(passArray[i]) >= 48 && Convert.ToInt16(passArray[i]) <= 57)
                    {
                        Pass_value = Pass_value + 18;
                    }
                }

                if (Convert.ToInt16(passArray[i]) >= 33 && Convert.ToInt16(passArray[i]) <= 47)
                {
                    Pass_value = Pass_value + 13;
                }

                passArray[i] = Convert.ToChar(Pass_value);
            }
            return new string(passArray);
        }
        //--------------------------------------------------Password Encoding---------------------------------------------------//

        // POST: User/Create
        [HttpPost]
        public JsonResult UserRegistration(UserRegModel usrReg)
        {
            if (Session["logUser"] != null)
            {
                try
                {
                    using (Three_Sixty_RotationEntities dbEntity = new Three_Sixty_RotationEntities())
                    {
                        var checkUser = Convert.ToInt16(dbEntity.UserRegisters.Where(user => user.Username == usrReg.Username).Count());
                        if (checkUser > 0)
                        {
                            return new JsonResult { Data = new { message = "User name already exist. Provide another user name.", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                        }

                        UserRegister loginModel = new UserRegister();
                        int autoID = (dbEntity.UserRegisters.ToList().Count() > 0) ? (dbEntity.UserRegisters.Max(s => s.AutoID + 1)) : 1;
                        if (autoID >= 0 && autoID <= 9)
                            loginModel.UserID = "U-0" + autoID.ToString();
                        else
                            loginModel.UserID = "U-" + autoID.ToString();
                        loginModel.Text_Value = usrReg.Password;

                        loginModel.Username = usrReg.Username;
                        loginModel.Password = PasswordEncoding(usrReg.Password);
                        loginModel.CreatedBy = Session["logUser"].ToString();
                        loginModel.EntryDateTime = DateTime.Now;
                        loginModel.EntryIP = Session["logIP"].ToString();
                        loginModel.FirstName = usrReg.FirstName;
                        loginModel.LastName = usrReg.LastName;
                        loginModel.ContactNo = usrReg.ContactNo;
                        loginModel.Address = usrReg.Address;
                        loginModel.Active = true;

                        loginModel.UserTypeID = usrReg.UserTypeID;

                        loginModel.BuyerID = usrReg.BuyerId;

                        dbEntity.UserRegisters.Add(loginModel);
                        dbEntity.SaveChanges();

                        if (usrReg.UserTypeID == "UT-04")
                        {
                            LogCheck logModel = new LogCheck();
                            logModel.UserID = loginModel.UserID;
                            logModel.StartsFrom = DateTime.Now;
                            logModel.LogCheck1 = usrReg.chkLog.AddDays(1).AddSeconds(-1);
                            logModel.CreatedBY = loginModel.CreatedBy;
                            logModel.EntryIP = loginModel.EntryIP;
                            logModel.EntryDateTime = DateTime.Now;

                            dbEntity.LogChecks.Add(logModel);
                            dbEntity.SaveChanges();
                        }
                    }
                    return new JsonResult { Data = new { message = "Register user successfully.", type = "success" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                catch (Exception Exp)
                {
                    return new JsonResult { Data = new { message = Exp.ToString(), type = "error" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
            }
            else
            {
                return new JsonResult { Data = new { message = "You are not authorized!!!", type = "warn" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }


        [HttpPost]
        public void EntryUserBlockInfo(string UserName)
        {
            try
            {
                using (Three_Sixty_RotationEntities dbEntity = new Three_Sixty_RotationEntities())
                {
                    UnauthorizedLogInfo unLogInfo = new UnauthorizedLogInfo();
                    unLogInfo.Date = DateTime.Now;
                    unLogInfo.UserName = UserName;
                    unLogInfo.EntryIP = Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? Request.ServerVariables["REMOTE_ADDR"];

                    dbEntity.UnauthorizedLogInfoes.Add(unLogInfo);
                    dbEntity.SaveChanges();

                    var countBlockUserInfo = dbEntity.UnauthorizedLogInfoes.Where(val => val.UserName == UserName && val.Date >= SqlFunctions.DateAdd("MI", -30, DateTime.Now) && val.Date <= DateTime.Now).Count();
                    if (countBlockUserInfo >= 3)
                    {
                        UnauthorizedUserBlockInfo ubi = new UnauthorizedUserBlockInfo();
                        var rowCount = dbEntity.UnauthorizedUserBlockInfoes.Where(val => val.UserName == UserName && DbFunctions.TruncateTime(val.Date) == DbFunctions.TruncateTime(DateTime.Today)).Count();
                        if (rowCount > 0)
                        {
                            ubi = dbEntity.UnauthorizedUserBlockInfoes.Where(val => val.UserName == UserName && DbFunctions.TruncateTime(val.Date) == DbFunctions.TruncateTime(DateTime.Today)).FirstOrDefault();
                            dbEntity.Entry(ubi).State = EntityState.Deleted;
                            dbEntity.SaveChanges();

                        }

                        ubi.Date = DateTime.Now;
                        ubi.UserName = UserName;
                        ubi.BlockTime = 30;

                        dbEntity.UnauthorizedUserBlockInfoes.Add(ubi);
                        dbEntity.SaveChanges();
                    }
                }
            }
            catch (Exception Exp) { }
        }
    }
}