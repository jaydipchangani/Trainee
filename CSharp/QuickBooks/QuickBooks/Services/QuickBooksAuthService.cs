
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Web;

public class QuickBooksAuthService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public QuickBooksAuthService(IConfiguration config)
    {
        _config = config;
        _httpClient = new HttpClient();
    }


    public string GetAuthUrl()
    {
        var clientId = _config["QuickBooks:ClientId"];
        var redirectUrl = HttpUtility.UrlEncode(_config["QuickBooks:RedirectUri"]);
        var scope = HttpUtility.UrlEncode("com.intuit.quickbooks.accounting");

        var state = Guid.NewGuid().ToString();

        var authUrl = $"https://appcenter.intuit.com/connect/oauth2?" +
                      $"client_id={clientId}&" +
                      $"redirect_uri={redirectUrl}&" +
                      $"response_type=code&" +
                      $"scope={scope}&" +
                      $"state={state}";

        return authUrl;
    }

    public async Task<QuickBooksTokenResponse> ExchangeCodeForTokensAsync(string code)
    {
        var clientId = _config["QuickBooks:ClientId"];
        var clientSecret = _config["QuickBooks:ClientSecret"];
        var redirectUri = _config["QuickBooks:RedirectUri"];

        var tokenUrl = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
        var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

        var request = new HttpRequestMessage(HttpMethod.Post, tokenUrl)
        {
            Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
            })
        };

        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await _httpClient.SendAsync(request);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("Token exchange failed: " + responseContent);
            throw new Exception("Failed to exchange code for tokens.");
        }

        var tokenData = JsonSerializer.Deserialize<QuickBooksTokenResponse>(responseContent);

        return tokenData!;
    }


}

public class QuickBooksTokenResponse
{
    public string access_token { get; set; } = "";
    public int expires_in { get; set; }
    public string refresh_token { get; set; } = "";
    public int x_refresh_token_expires_in { get; set; }
    public string token_type { get; set; } = "";
}
