using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemoMVCApplication.Models
{
    public class UserRegModel
    {

        public string UserID { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string UserTypeID { get; set; }
        public DateTime chkLog { get; set; }
        public string BuyerId { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
    }
}