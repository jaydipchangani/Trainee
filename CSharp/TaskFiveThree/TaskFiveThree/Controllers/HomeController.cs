using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TaskFiveThree.Models;

namespace TaskFiveThree.Controllers;

public class HomeController : Controller
{

    private readonly IConfiguration _configuration;
    public HomeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IActionResult Index()
    {
        ViewBag.AppName = _configuration["ApplicationSettings:AppName"];
        ViewBag.Version = _configuration["ApplicationSettings:Version"];
        ViewBag.Auth = bool.Parse(_configuration["ApplicationSettings:Auth"]);

        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
