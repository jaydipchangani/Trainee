using Microsoft.AspNetCore.Mvc;
using taskFour.Models;

namespace taskFour.Controllers
{
    public class StudentController : Controller
    {
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(Student students) {
            if (ModelState.IsValid)
            {

                TempData["msg"] = "Student Registration Successfully";
                return View("Index");
            }
            return View("Index");
        }

    }
}
