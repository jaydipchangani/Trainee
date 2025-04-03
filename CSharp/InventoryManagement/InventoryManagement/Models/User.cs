using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }  // Auto-generated ID

        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Hashed Password

        [Required, MaxLength(20)]
        public string Role { get; set; } = "User"; // Default Role
    }
}
