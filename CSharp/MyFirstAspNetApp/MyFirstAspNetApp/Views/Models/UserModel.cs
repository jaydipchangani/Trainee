using System.ComponentModel.DataAnnotations;

public class UserModel
{
    [Required(ErrorMessage = "First Name is required")]
    [StringLength(15, MinimumLength = 3, ErrorMessage = "Name must be between 3-15 characters")]
    public string Fname { get; set; }

    public string Lname { get; set; }

    [Required(ErrorMessage = "Quantity is required")]
    [Range(1, 5, ErrorMessage = "Quantity must be between 1-5")]
    public int Quantity { get; set; }
    public string Address { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
}
