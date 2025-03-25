namespace ASPNetCoreMVCApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } // Encrypted password
        public int? RoleId { get; set; }
        public bool IsActive { get; set; }

        
    }


}
