using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Task9.Models;
using Task9.Services;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Security.Claims;

namespace Task9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenServices _tokenServices;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMongoCollection<ApplicationUser> _usersCollection;

        public AuthController(TokenServices tokenServices, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, IMongoCollection<ApplicationUser> usersCollection)
        {
            _tokenServices = tokenServices;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _usersCollection = usersCollection;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Login Request");
            }

            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user == null)
            {
                return BadRequest("Invalid Username or Password");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginModel.Password);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";

            var accessToken = _tokenServices.GenerateToken(user.Id.ToString(), user.Email, role, user.TokenVersion);
            var refreshToken = _tokenServices.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _userManager.UpdateAsync(user);

            return Ok(new { AccessToken = accessToken, RefreshToken = refreshToken });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Register Request");
            }

            var userExists = await _userManager.FindByEmailAsync(registerModel.Email);
            if (userExists != null)
            {
                return BadRequest("User already exists.");
            }

            var user = new ApplicationUser
            {
                UserName = registerModel.Username,
                Email = registerModel.Email
            };

            var result = await _userManager.CreateAsync(user, registerModel.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }

            var role = registerModel.Role ?? "User";
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists)
            {
                return BadRequest($"Role '{role}' does not exist.");
            }

            await _userManager.AddToRoleAsync(user, role);
            return Ok("User created successfully");
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest refreshRequest)
        {
            if (string.IsNullOrEmpty(refreshRequest.RefreshToken))
            {
                return BadRequest("Refresh token is required.");
            }

            var filter = Builders<ApplicationUser>.Filter.Eq(u => u.RefreshToken, refreshRequest.RefreshToken);
            var user = await _usersCollection.Find(filter).FirstOrDefaultAsync();

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";

            // Increment the token version to invalidate previous tokens
            user.TokenVersion++;

            var newAccessToken = _tokenServices.GenerateToken(user.Id.ToString(), user.Email, role, user.TokenVersion);
            var newRefreshToken = _tokenServices.GenerateRefreshToken();

            // Update refresh token and expiry
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _userManager.UpdateAsync(user);

            return Ok(new { AccessToken = newAccessToken, RefreshToken = newRefreshToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized("Invalid user.");
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiry = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return Ok("Logged out successfully.");
        }


    }
}
