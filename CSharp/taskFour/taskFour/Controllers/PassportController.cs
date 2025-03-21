using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using taskFour.Models;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace taskFour.Controllers
{
    public class PassportController : Controller
    {
        [HttpGet]
        public IActionResult Apply()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Apply(PassportModel model, IFormFile PassportPhoto)
        {
            if (ModelState.IsValid)
            {
                if (PassportPhoto != null && PassportPhoto.Length > 0)
                {
                    string fileName = Path.GetFileName(PassportPhoto.FileName);
                    string filePath = Path.Combine("wwwroot/uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        PassportPhoto.CopyTo(stream);
                    }
                    model.PassportPhoto = "/uploads/" + fileName;
                }

                // Serialize & Store in TempData
                TempData["PassportData"] = JsonConvert.SerializeObject(model);
                return RedirectToAction("Details");
            }
            return View("Apply",model);
        }

        public IActionResult Details()
        {
            if (TempData["PassportData"] != null)
            {
                var passportData = JsonConvert.DeserializeObject<PassportModel>(TempData["PassportData"].ToString());
                return View(passportData); // Ensure this matches the View's expected model type
            }
            return RedirectToAction("Apply");
        }
    }
}