using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;
using QuickBookAPI.Models;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;
    private readonly MongoTokenService _mongoService;

    public AuthController(IConfiguration config)
    {
        _config = config;
        _httpClient = new HttpClient();
        _mongoService = new MongoTokenService(config);
    }


    [HttpGet("login")]
    public IActionResult Login()
    {
        var authUrl = $"{_config["QuickBooks:BaseAuthUrl"]}?" +
                      $"client_id={_config["QuickBooks:ClientId"]}&" +
                      "response_type=code&" +
                      $"redirect_uri={_config["QuickBooks:RedirectUri"]}&" +
                      "scope=com.intuit.quickbooks.accounting&" +
                      "state=xyz123"; 

        return Redirect(authUrl);
    }

    [HttpPost("callback")]
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

        var tokenResult = JsonSerializer.Deserialize<OAuthTokenResponse>(
            responseContent,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        await _mongoService.SaveTokenAsync(new TokenRecord
        {
            AccessToken = tokenResult.AccessToken,
            RefreshToken = tokenResult.RefreshToken,
            ExpiresIn = tokenResult.ExpiresIn,
            CreatedAt = DateTime.UtcNow
        });

        return Ok(responseContent);
    }



}

[Route("api/quickbooks")]
[ApiController]

public class QuickBooksController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IMongoService _mongoService;

    public QuickBooksController(IMongoService mongoService)
    {
        _httpClient = new HttpClient();
        _mongoService = mongoService;
    }

    [HttpGet("accounts")]
    public async Task<IActionResult> GetAccounts([FromQuery] string accessToken, [FromQuery] string realmId)
    {
        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(realmId))
        {
            return BadRequest("Missing accessToken or realmId");
        }

        var apiUrl = $"https://sandbox-quickbooks.api.intuit.com/v3/company/{realmId}/query";
        var query = "SELECT * FROM Account";

        var request = new HttpRequestMessage(HttpMethod.Get, $"{apiUrl}?query={query}");
        request.Headers.Add("Authorization", $"Bearer {accessToken}");
        request.Headers.Add("Accept", "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("QuickBooks API Error: " + responseContent);
            return BadRequest("Failed to fetch accounts from QuickBooks");
        }

        // Parse and map the response JSON to QuickBooksAccount list
        using var doc = JsonDocument.Parse(responseContent);
        var accounts = new List<QuickBooksAccount>();

        var accountArray = doc.RootElement
                              .GetProperty("QueryResponse")
                              .GetProperty("Account")
                              .EnumerateArray();

        foreach (var item in accountArray)
        {
            accounts.Add(new QuickBooksAccount
            {
                Name = item.GetProperty("Name").GetString(),
                AccountType = item.GetProperty("AccountType").GetString(),
                AccountSubType = item.TryGetProperty("AccountSubType", out var subType) ? subType.GetString() : null,
                FullyQualifiedName = item.TryGetProperty("FullyQualifiedName", out var fq) ? fq.GetString() : null,
                Classification = item.TryGetProperty("Classification", out var cl) ? cl.GetString() : null,
                QuickBooksId = item.GetProperty("Id").GetString()
            });
        }

        await _mongoService.SaveAccountsAsync(accounts);

        return Ok(new { message = "Accounts fetched and stored", count = accounts.Count });
    }

    [HttpGet("accounts/mongo")]
    public async Task<IActionResult> GetAccountsFromMongo()
    {
        var accounts = await _mongoService.GetAccountsAsync();
        return Ok(accounts);
    }



}


