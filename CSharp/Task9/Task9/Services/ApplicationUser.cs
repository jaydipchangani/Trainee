using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace Task9.Services
{
    [CollectionName("Users")]
    public class ApplicationUser : MongoIdentityUser<Guid>
    {
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
        public int TokenVersion { get; set; } = 1;
    }
}
