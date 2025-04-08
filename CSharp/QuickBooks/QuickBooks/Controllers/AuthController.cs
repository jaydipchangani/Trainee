using System.Web;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly QuickBooksAuthService _authService;

    public AuthController(QuickBooksAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("login")]
    public IActionResult Login()
    {
        var authUrl = _authService.GetAuthUrl();
        return Redirect(authUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        var token = await _authService.GetAccessTokenAsync(code);
        // For now, we just return the token (you can return to React)
        return Redirect($"http://localhost:5173/dashboard?token={HttpUtility.UrlEncode(token)}");
    }
}
