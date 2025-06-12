using Microsoft.AspNetCore.Mvc;
using taskFour.Models;

namespace taskFour.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult ProductForm()
        {
            return View();
        }

        [HttpPost]
        public IActionResult ProductForm(Product p)
        {
            if (ModelState.IsValid)
            {

                TempData["success"] = "Product added Successfully";
                return RedirectToAction("Index", "Product");
            }
            return View(p);
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
