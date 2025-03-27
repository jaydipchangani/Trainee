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
using System.Text.RegularExpressions;

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
            if (string.IsNullOrWhiteSpace(username) || !Regex.IsMatch(username, @"^[a-zA-Z]+$") || username.Length < 3 || username.Length > 50)
            {
                throw new Exception("Username is invalid. It should only contain letters and be between 3 and 50 characters.");
            }

            if (string.IsNullOrWhiteSpace(password) || !Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"))
            {
                throw new Exception("Password is invalid. It must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a digit, and a special character.");
            }


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
            return "User Registered !!";
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new Exception("Username cannot be empty.");
            }

            // Validate password
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new Exception("Password cannot be empty.");
            }

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
