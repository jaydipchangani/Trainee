using Microsoft.AspNetCore.Mvc;

namespace MyFirstAspNetApp.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
