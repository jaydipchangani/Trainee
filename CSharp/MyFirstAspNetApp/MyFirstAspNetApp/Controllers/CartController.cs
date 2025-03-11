using Microsoft.AspNetCore.Mvc;

public class CartController : Controller
{
    public IActionResult Index()
    {
        return View(); // This will look for Views/Cart/Index.cshtml
    }

    public IActionResult NewPage()
    {
        return View(); // Looks for Views/Cart/NewPage.cshtml
    }
}
