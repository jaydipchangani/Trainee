using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AuthController(IConfiguration config)
    {
        _config = config;
        _httpClient = new HttpClient();
    }


    // Step 1: Redirect User to QuickBooks for Login
    [HttpGet("login")]
    public IActionResult Login()
    {
        var authUrl = $"{_config["QuickBooks:BaseAuthUrl"]}?" +
                      $"client_id={_config["QuickBooks:ClientId"]}&" +
                      "response_type=code&" +
                      $"redirect_uri={_config["QuickBooks:RedirectUri"]}&" +
                      "scope=com.intuit.quickbooks.accounting&" +
                      "state=xyz123"; // State parameter for security

        return Redirect(authUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code)
    {
        if (string.IsNullOrEmpty(code))
        {
            return BadRequest("Authorization code is missing!");
        }

        var clientId = _config["QuickBooks:ClientId"];
        var clientSecret = _config["QuickBooks:ClientSecret"];
        var redirectUri = _config["QuickBooks:RedirectUri"];
        var tokenUrl = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

        // Create Basic Authentication Header
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
        var authHeader = $"Basic {credentials}";

        var requestBody = new Dictionary<string, string>
        {
            { "grant_type", "authorization_code" },
            { "code", code },
            { "redirect_uri", redirectUri }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, tokenUrl)
        {
            Content = new FormUrlEncodedContent(requestBody)
        };
        request.Headers.Add("Authorization", authHeader);
        request.Headers.Add("Accept", "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("QuickBooks OAuth Error: " + responseContent);
            return BadRequest("Failed to exchange auth code for tokens");
        }

        return Ok(responseContent);
    }

}

// Response Model
public class OAuthTokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
}
