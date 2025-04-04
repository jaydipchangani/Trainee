using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Collections.Generic;
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
        var authUrl = $"{_config["QuickBooks:BaseAuthUrl"]}?" +
                      $"client_id={_config["QuickBooks:ClientId"]}&" +
                      "response_type=code&" +
                      $"redirect_uri={_config["QuickBooks:RedirectUri"]}&" +
                      "scope=com.intuit.quickbooks.accounting&" +
                      "state=xyz123"; // State parameter for security

        return Redirect(authUrl);
    }

    // Step 2: QuickBooks Redirects to Our App with Auth Code
    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code)
    {
        if (string.IsNullOrEmpty(code))
            return BadRequest("Authorization code is missing!");

        var client = new RestClient(_config["QuickBooks:TokenUrl"]);
        var request = new RestRequest();
        request.Method = Method.Post;
        request.AddHeader("Content-Type", "application/x-www-form-urlencoded");

        request.AddParameter("client_id", _config["QuickBooks:ClientId"]);
        request.AddParameter("client_secret", _config["QuickBooks:ClientSecret"]);
        request.AddParameter("grant_type", "authorization_code");
        request.AddParameter("code", code);
        request.AddParameter("redirect_uri", _config["QuickBooks:RedirectUri"]);

        var response = await client.ExecuteAsync<OAuthTokenResponse>(request);

        if (!response.IsSuccessful)
            return BadRequest("Failed to get access token!");

        return Ok(new
        {
            AccessToken = response.Data.AccessToken,
            RefreshToken = response.Data.RefreshToken,
            ExpiresIn = response.Data.ExpiresIn
        });
    }
}

// Response Model
public class OAuthTokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
}
