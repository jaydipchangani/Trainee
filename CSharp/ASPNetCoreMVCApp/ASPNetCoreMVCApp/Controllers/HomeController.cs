using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreMVCApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("UserId") == null)
                return RedirectToAction("Login", "Account");

            return View();
        }
    }
}
