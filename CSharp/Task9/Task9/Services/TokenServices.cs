using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Task9.Services
{
    public class TokenServices
    {
        private readonly IConfiguration _configuration;

        public TokenServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string userId, string email, string role, int tokenVersion)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new[]
            {
                new Claim (ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim("TokenVersion", tokenVersion.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
