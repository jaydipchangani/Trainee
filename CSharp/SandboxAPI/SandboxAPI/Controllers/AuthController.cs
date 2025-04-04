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
        public async Task<IActionResult> Callback([FromQuery] string code)
        {
            try
            {
                string token = await _oauthService.GetAccessTokenAsync(code);
                return Ok(new { accessToken = token });
            }
            catch
            {
                return Unauthorized("OAuth authentication failed");
            }
        }
    }
}
