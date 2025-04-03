using System.ComponentModel.DataAnnotations;

namespace InventoryManagementAPI.Models
{
    public class User
    {
        public int Id { get; set; } // Auto-increment primary key
        public string Username { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; } // e.g., "Admin" or "User"
        public int Status { get; set; } = 1; // 1 for active, 0 for inactive
        public string PasswordHash { get; set; } //  Ensure this is present
        public int? ServiceCenterId { get; set; } // Only required if Role is "Admin"

        public ServiceCenter? ServiceCenter { get; set; } // Navigation property
    }

}
