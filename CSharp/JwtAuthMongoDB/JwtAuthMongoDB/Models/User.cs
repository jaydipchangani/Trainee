namespace JwtAuthMongoDB.Models
{
    public class User
    {
        public string? Id { get; set; }
        public string UserName { get; set; } = null;
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";


    }
}
