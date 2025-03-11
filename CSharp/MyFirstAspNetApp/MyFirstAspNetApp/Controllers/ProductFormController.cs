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
        public IActionResult Index(string fname,string lname)
        {
            ViewData["Message"] = "Hello " + fname + " "+lname;
            return View();
        }
    }
}
   