using Microsoft.AspNetCore.Mvc;

namespace taskFour.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult StudentList()
        {
            return View();
        }
    }
}
