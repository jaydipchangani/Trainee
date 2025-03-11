using Microsoft.AspNetCore.Mvc;

namespace MyFirstAspNetApp.Controllers
{
    public class HelloController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
