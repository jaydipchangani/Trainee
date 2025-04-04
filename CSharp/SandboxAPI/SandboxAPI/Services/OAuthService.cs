using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace SandboxAPI.Services

{
    public class OAuthService
    {
        private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public OAuthService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    // Step 1: Redirect user to OAuth provider
    public string GetAuthorizationUrl()
    {
        string authUrl = $"{_config["OAuthSettings:AuthorizationUrl"]}" +
                         $"?client_id={_config["OAuthSettings:ClientId"]}" +
                         $"&redirect_uri={_config["OAuthSettings:RedirectUri"]}" +
                         $"&response_type=code&scope=read_profile";
        return authUrl;
    }

    // Step 2: Exchange code for access token
    public async Task<string> GetAccessTokenAsync(string code)
    {
        var payload = new
        {
            client_id = _config["OAuthSettings:ClientId"],
            client_secret = _config["OAuthSettings:ClientSecret"],
            code = code,
            grant_type = "authorization_code",
            redirect_uri = _config["OAuthSettings:RedirectUri"]
        };

        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
        HttpResponseMessage response = await _httpClient.PostAsync(_config["OAuthSettings:TokenUrl"], content);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("OAuth token exchange failed");
        }

        var responseData = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonConvert.DeserializeObject<dynamic>(responseData);
        return jsonResponse.access_token;
    }
    }
}
