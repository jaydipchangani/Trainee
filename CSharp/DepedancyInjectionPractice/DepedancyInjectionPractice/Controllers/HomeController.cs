using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DepedancyInjectionPractice.Models;
using DepedancyInjectionPractice.Services;

namespace DepedancyInjectionPractice.Controllers;

public class HomeController : Controller
{
    private readonly IEmailService _service;

    public HomeController(IEmailService service)
    {
        _service = service;
    }

    public IActionResult Index()
    {
        TempData["email"] = _service.getEmail("asdasdsad");
        
        return View();
    }

    public IActionResult Privacy()
    {
        TempData["email"] = _service.getEmail("hello");
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
