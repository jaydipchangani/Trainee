using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Text;
using System.Threading.Tasks;


[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    // Step 1: Redirect User to QuickBooks for Login
    [HttpGet("login")]
    public IActionResult Login()
    {
        var clientId = _config["QuickBooks:ClientId"];
        var redirectUri = _config["QuickBooks:RedirectUri"];
        var scope = "com.intuit.quickbooks.accounting";

        var authUrl = $"https://appcenter.intuit.com/connect/oauth2" +
                      $"?client_id={clientId}" +
                      $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                      $"&response_type=code" +
                      $"&scope={Uri.EscapeDataString(scope)}" +
                      $"&state=123456";

        return Redirect(authUrl);
    }

    public class CodeRequest
    {
        public string Code { get; set; }
        public string State { get; set; }
        public string RealmId { get; set; }
    }

    // Step 2: QuickBooks Redirects to Our App with Auth Code
    [HttpPost("callback")]
    public async Task<IActionResult> Callback([FromBody] CodeRequest requestBody)
    {
        var code = requestBody?.Code;

        if (string.IsNullOrEmpty(code))
        {
            return BadRequest("Authorization code is missing!");
        }

        var clientId = _config["QuickBooks:ClientId"];
        var clientSecret = _config["QuickBooks:ClientSecret"];
        var redirectUri = _config["QuickBooks:RedirectUri"];
        var tokenUrl = _config["QuickBooks:TokenUrl"] ?? "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

        var client = new RestClient(tokenUrl);
        var request = new RestRequest("", Method.Post);

        // Basic Auth Header
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
        request.AddHeader("Authorization", $"Basic {credentials}");
        request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
        request.AddHeader("Accept", "application/json");

        request.AddParameter("grant_type", "authorization_code");
        request.AddParameter("code", code);
        request.AddParameter("redirect_uri", redirectUri);

        var response = await client.ExecuteAsync<OAuthTokenResponse>(request);

        if (!response.IsSuccessful || response.Data == null)
        {
            return BadRequest("Token exchange failed.");
        }

        var accessToken = response.Data.AccessToken;
        var refreshToken = response.Data.RefreshToken;
        var expiresIn = response.Data.ExpiresIn;

        // Pass token to frontend using query param
        string uiRedirectUrl = $"http://localhost:5173/dashboard?token={accessToken}";
        return Redirect(uiRedirectUrl);
    }

}
