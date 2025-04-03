using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; } // Auto-increment primary key

        [Required]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } // e.g., "Admin" or "User"

        public int Status { get; set; } = 1; // 1 for active, 0 for inactive

        [Required]
        public string PasswordHash { get; set; } // Ensure password is stored securely

        public int? ServiceCenterId { get; set; }

        [ForeignKey("ServiceCenterId")]
        public virtual ServiceCenter? ServiceCenter { get; set; }
    }
}
