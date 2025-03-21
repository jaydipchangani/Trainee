using Microsoft.AspNetCore.Mvc;

namespace taskFour.Controllers
{
    public class StudentController : Controller
    {
        public IActionResult Register()
        {
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Create(StudentController students) {
            if (ModelState.IsValid)
            {

                ViewBag.Message = "Student added successfully!";
                ModelState.Clear();
                return View();
            }
            return View(students);
        }

    }
}
