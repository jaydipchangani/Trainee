using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreMVCApp.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [RegularExpression("^[A-Za-z]+$", ErrorMessage = "Last name should contain only letters.")]
        [MinLength(3, ErrorMessage = "Last name must be at least 3 characters.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required.")]
        [RegularExpression("^[A-Za-z]+$", ErrorMessage = "Last name should contain only letters.")]
        [MinLength(3, ErrorMessage = "Last name must be at least 3 characters.")]
        public string LastName { get; set; }

          
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        [RegularExpression("^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        ErrorMessage = "Password must contain an uppercase letter, a number, and a special character.")]
        public string PasswordHash { get; set; } // Encrypted password


        [Required(ErrorMessage = "Confirm password is required.")]
        [Compare("PasswordHash", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; }
        public int? RoleId { get; set; }
        public bool IsActive { get; set; }

        
    }


}
