using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Task9.Services;
using System.Linq;
using System.Threading.Tasks;

namespace Task9.Middlewares
{
    public class TokenValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMongoCollection<ApplicationUser> _usersCollection;

        public TokenValidationMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;

            var client = new MongoClient(configuration["MongoDB:ConnectionString"]);
            var database = client.GetDatabase(configuration["MongoDB:DatabaseName"]);
            _usersCollection = database.GetCollection<ApplicationUser>("Users");
        }

        public async Task Invoke(HttpContext context)
        {
            var authorizationHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
            {
                var token = authorizationHeader.Substring(7);
                var handler = new JwtSecurityTokenHandler();

                if (handler.CanReadToken(token))
                {
                    var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

                    if (jwtToken != null)
                    {
                        var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
                        var tokenVersionClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "TokenVersion")?.Value;

                        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out Guid userGuid) &&
                            !string.IsNullOrEmpty(tokenVersionClaim) && int.TryParse(tokenVersionClaim, out int tokenVersion))
                        {
                            var user = await _usersCollection.Find(u => u.Id == userGuid).FirstOrDefaultAsync();

                            if (user == null || tokenVersion < user.TokenVersion)
                            {
                                context.Response.StatusCode = 401;
                                await context.Response.WriteAsync("Token expired. Please log in again.");
                                return;
                            }
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}
