

using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace SandboxAPI.Services

{
    public class OAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OAuthService(HttpClient httpClient, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }

        // Step 1: Redirect user to OAuth provider
        public string GetAuthorizationUrl()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                throw new Exception("HttpContext is null. Ensure session is enabled.");
            }

            string state = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

            // ✅ Store state in session
            context.Session.SetString("oauth_state", state);

            string scope = "openid profile email"; // Replace with valid scopes from your OAuth provider

            string authUrl = $"{_config["OAuthSettings:AuthorizationUrl"]}" +
                             $"?client_id={_config["OAuthSettings:ClientId"]}" +
                             $"&redirect_uri={Uri.EscapeDataString(_config["OAuthSettings:RedirectUri"])}" +
                             $"&response_type=code" +
                             $"&scope={Uri.EscapeDataString(scope)}" + // ✅ Fix encoding for scopes
                             $"&state={state}";

            // ✅ Debugging - Print generated URL
            Console.WriteLine("Generated OAuth URL: " + authUrl);


            return authUrl;
        }


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

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.PostAsync(_config["OAuthSettings:TokenUrl"], content);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OAuth Token Request Failed: {ex.Message}");
                throw new Exception("OAuth token request failed");
            }

            if (!response.IsSuccessStatusCode)
            {
                string errorResponse = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"OAuth Token Error: {errorResponse}");
                throw new Exception($"OAuth token exchange failed: {errorResponse}");
            }

            var responseData = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonConvert.DeserializeObject<dynamic>(responseData);

            if (jsonResponse?.access_token == null)
            {
                throw new Exception("OAuth token exchange failed: No access token received");
            }

            Console.WriteLine("OAuth Token Retrieved Successfully!");
            return jsonResponse.access_token;
        }
        // Step 2: Exchange code for access token
    }
}
