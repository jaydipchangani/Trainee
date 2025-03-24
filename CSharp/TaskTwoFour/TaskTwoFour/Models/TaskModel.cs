using System.ComponentModel.DataAnnotations;

namespace TaskTwoFour.Models
{
    public class TaskModel
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DueDate { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
