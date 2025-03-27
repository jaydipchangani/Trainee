using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtAuthMongoDB.Models;
using JwtAuthMongoDB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace JwtAuthMongoDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _config;

        public AuthController(UserService userService,IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var existingUser = await _userService.GetUserByUsernameAsync(user.UserName);
            if (existingUser != null)
                return BadRequest("User already exists.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            await _userService.CreateUserAsync(user);

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var existingUser = await _userService.GetUserByUsernameAsync(user.UserName);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.PasswordHash, existingUser.PasswordHash))
                return Unauthorized("Invalid username or password.");

            var token = GenerateJwtToken(existingUser);
            return Ok(new { Token = token });
        }
        [HttpPost("generate-token")]
        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.Role)
        };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("protected")]
        [Authorize(AuthenticationSchemes = "Bearer")] // Ensures only JWT Bearer tokens are used
        public IActionResult ProtectedEndpoint()
        {
            // If token is invalid or missing, the request will be rejected before reaching here
            return Ok("You have accessed a protected route!");
        }

    }
}
