using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; }
    public string Role { get; set; }

    public string? ServiceCenterId { get; set; } // Make sure it's nullable for non-admin users
    public virtual ServiceCenter? ServiceCenter { get; set; } // Navigation Property
}
