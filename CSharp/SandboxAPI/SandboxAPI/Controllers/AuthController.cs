using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SandboxAPI.Services;

namespace SandboxAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly OAuthService _oauthService;

        public AuthController(OAuthService oauthService)
        {
            _oauthService = oauthService;
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            string authUrl = _oauthService.GetAuthorizationUrl();
            return Redirect(authUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (string.IsNullOrEmpty(code))
            {
                Console.WriteLine("❌ Missing OAuth Code");
                return BadRequest("Missing OAuth Code");
            }

            Console.WriteLine($"🔑 Received OAuth Code: {code}");

            // Validate state (if required)
            string savedState = HttpContext.Session.GetString("oauth_state");
            if (string.IsNullOrEmpty(savedState) || savedState != state)
            {
                Console.WriteLine("❌ Invalid OAuth State");
                return BadRequest("Invalid OAuth State");
            }

            try
            {
                string accessToken = await _oauthService.GetAccessTokenAsync(code);
                Console.WriteLine($"✅ Access Token: {accessToken}");

                HttpContext.Session.SetString("access_token", accessToken);
                return Redirect("http://localhost:5173/dashboard"); // Redirect to frontend
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ OAuth Token Exchange Failed: {ex.Message}");
                return BadRequest("OAuth Token Exchange Failed");
            }
        }










    }


}
