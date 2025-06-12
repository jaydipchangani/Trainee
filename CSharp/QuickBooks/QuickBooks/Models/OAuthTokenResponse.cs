public class OAuthTokenResponse
{
    public string AccessToken { get; set; }
    public int ExpiresIn { get; set; }
    public string RefreshToken { get; set; }
    public int XRefreshTokenExpiresIn { get; set; }
    public string TokenType { get; set; }
    public string Scope { get; set; }
}