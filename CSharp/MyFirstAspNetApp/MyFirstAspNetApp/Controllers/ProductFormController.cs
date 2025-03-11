using Microsoft.AspNetCore.Mvc;
using MyFirstAspNetApp.Models;

namespace MyFirstAspNetApp.Controllers
{
    public class ProductFormController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(UserModel user)
        {
            return View(user);
        }
    }
}
   