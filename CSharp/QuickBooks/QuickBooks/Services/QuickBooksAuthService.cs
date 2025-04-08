
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Web;

public class QuickBooksAuthService
{
    private readonly IConfiguration _config;

    public QuickBooksAuthService(IConfiguration config)
    {
        _config = config;
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

    public async Task<string> GetAccessTokenAsync(string code)
    {
        var client = new HttpClient();
        var clientId = _config["QuickBooks:ClientId"];
        var clientSecret = _config["QuickBooks:ClientSecret"];
        var redirectUri = _config["QuickBooks:RedirectUrl"];

        var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer");

        var authString = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authString);

        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", redirectUri),
        });

        request.Content = content;

        var response = await client.SendAsync(request);
        return await response.Content.ReadAsStringAsync(); // token response
    }
}
