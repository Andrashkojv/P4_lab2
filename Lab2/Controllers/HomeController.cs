using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lab2.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }


        // контролер сторінки реєстрації користувача 
        public ActionResult Register()
        {
            return View();
        }
        // контролер сторінки входу користувача 
        public ActionResult Login()
        {
            return View();
        }

        //Метод для створення сторінки тестування API 
        public ActionResult TestApi()
        {
            return View();
        }
    }
}

