// In Services/IUserService.cs
namespace JwtAuthMongoExample.Services
{
    public interface IUserService
    {
        Task<string> RegisterAsync(string username, string password);
        Task<string> LoginAsync(string username, string password);
    }
}
