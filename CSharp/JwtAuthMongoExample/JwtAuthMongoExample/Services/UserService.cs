using JwtAuthMongoExample.Data;
using JwtAuthMongoExample.Models;
using MongoDB.Driver;
using BCrypt.Net;
using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JwtAuthMongoExample.Services
{
    public class UserService : IUserService
    {
        private readonly MongoDbContext _context;
        private readonly IConfiguration _configuration;

        public UserService(MongoDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(string username, string password)
        {
            // Check if user already exists
            var userExists = await _context.Users.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (userExists != null)
            {
                throw new Exception("User already exists");
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Id = Guid.NewGuid(),  // Generate a new GUID for the Id
                Username = username,
                PasswordHash = passwordHash,
                Role = "User"  // Set a default role
            };

            // Insert into MongoDB (MongoDB will store GUID as string due to the BsonRepresentation attribute)
            await _context.Users.InsertOneAsync(user);

            // Return JWT token
            return GenerateJwtToken(user);
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var user = await _context.Users.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Convert GUID to string
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expirationTime = DateTime.UtcNow.AddDays(1);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expirationTime,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
