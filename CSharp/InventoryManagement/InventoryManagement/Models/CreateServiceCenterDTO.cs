using System.ComponentModel.DataAnnotations;

public class CreateServiceCenterDTO
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string PrimaryContactName { get; set; }

    [Required]
    [Phone]
    public string PhoneNumber { get; set; }

    [Required]
    public string Address { get; set; }
}
