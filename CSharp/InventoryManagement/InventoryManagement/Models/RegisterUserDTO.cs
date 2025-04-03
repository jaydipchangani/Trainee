using System.ComponentModel.DataAnnotations;

public class RegisterUserDTO
{
    [Required]
    public string FullName { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }

    [Required]
    public string Role { get; set; } // Admin or User

    public string? ServiceCenterId { get; set; } // Only required if Role is "Admin"

    [Required]
    [Phone]
    public string PhoneNumber { get; set; }
}
