using Microsoft.AspNetCore.Mvc;

namespace MyFirstAspNetApp.Controllers
{
    public class ProductFormController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(string username)
        {
            ViewData["Message"] = "Hello " + username + " !!";
            return View();
        }
    }
}
   