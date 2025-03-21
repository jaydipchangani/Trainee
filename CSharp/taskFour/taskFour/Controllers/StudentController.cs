using Microsoft.AspNetCore.Mvc;
using taskFour.Models;

namespace taskFour.Controllers
{
    public class StudentController : Controller
    {
        [HttpGet]
        public IActionResult Register()
        {
            ViewData["Instruction"] = "Enter Data carefully";
            return View();
        }

        [HttpPost]
        public IActionResult Register(Student students) {
            if (ModelState.IsValid)
            {

                TempData["sucessmsg"] = "Student Registration Successfully";
                return RedirectToAction("Index", "Student");
            }
            return View(students);
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
