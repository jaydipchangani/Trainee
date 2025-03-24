using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TaskFive.Models;
using TaskFive.Services;

namespace TaskFive.Controllers;

public class HomeController : Controller
{
    private readonly TransientGuidService _transient1;
    private readonly TransientGuidService _transient2;
    private readonly ScopedGuidService _scoped1;
    private readonly ScopedGuidService _scoped2;
    private readonly SingletonGuidService _singleton1;
    private readonly SingletonGuidService _singleton2;
   public HomeController(
            TransientGuidService transient1,
            TransientGuidService transient2,
            ScopedGuidService scoped1,
            ScopedGuidService scoped2,
            SingletonGuidService singleton1,
            SingletonGuidService singleton2)
        {
            _transient1 = transient1;
            _transient2 = transient2;
            _scoped1 = scoped1;
            _scoped2 = scoped2;
            _singleton1 = singleton1;
            _singleton2 = singleton2;
        }
    public IActionResult Index()
    {
        ViewBag.Transient1 = _transient1.GetGuid();
        ViewBag.Transient2 = _transient2.GetGuid();
        ViewBag.Scoped1 = _scoped1.GetGuid();
        ViewBag.Scoped2 = _scoped2.GetGuid();
        ViewBag.Singleton1 = _singleton1.GetGuid();
        ViewBag.Singleton2 = _singleton2.GetGuid();

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
