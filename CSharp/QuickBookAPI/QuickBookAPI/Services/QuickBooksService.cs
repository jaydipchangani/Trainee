using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using QuickBookAPI.Models;

public class QuickBooksService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public QuickBooksService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<OAuthTokenResponse> ExchangeCodeForToken(string authorizationCode)
    {
        var requestData = new
        {
            grant_type = "authorization_code",
            code = authorizationCode,
            redirect_uri = _config["QuickBooks:RedirectUri"],
            client_id = _config["QuickBooks:ClientId"],
            client_secret = _config["QuickBooks:ClientSecret"]
        };

        var requestBody = new StringContent(
            JsonSerializer.Serialize(requestData),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.PostAsync("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", requestBody);

        if (!response.IsSuccessStatusCode)
        {
            return null; // Handle error
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        //  Deserialize response into OAuthTokenResponse
        var tokenResponse = JsonSerializer.Deserialize<OAuthTokenResponse>(responseContent);

        return tokenResponse;
    }
}
