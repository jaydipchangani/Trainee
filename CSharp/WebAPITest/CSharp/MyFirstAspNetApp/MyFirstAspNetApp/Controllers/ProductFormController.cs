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
            if(!ModelState.IsValid)
            {
                return View(user);
            }

            return View(user);
        }
    }
}
   