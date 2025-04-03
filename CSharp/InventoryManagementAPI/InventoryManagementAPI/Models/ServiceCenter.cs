using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryManagementAPI.Models
{
    public class ServiceCenter
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        [MaxLength(15)]
        public string PrimaryContactNumber { get; set; }

        [MaxLength(15)]
        public string? PhoneNumber { get; set; }

        [Required]
        [MaxLength(255)]
        public string Address { get; set; }

        [Required]
        public int CreatedBy { get; set; }

        public DateTime ModifiedAt { get; set; } = DateTime.Now;

        [Required]
        public bool Status { get; set; } = true; // Default active
    }
}
