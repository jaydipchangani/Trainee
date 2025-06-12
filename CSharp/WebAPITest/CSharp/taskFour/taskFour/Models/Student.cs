using System.ComponentModel.DataAnnotations;

namespace taskFour.Models
{
    public class Student
    {

        [Required(ErrorMessage = "Student name is required")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Student name must be between 3 and 100 characters")]
        [RegularExpression(@"^(?!\s+$)[A-Za-z\s]+$", ErrorMessage = "Only alphabets and spaces are allowed. Name cannot be only spaces.")]
        public string name { get; set; }

        [Required(ErrorMessage = "Student Age is required")]
        [Range(18,60,ErrorMessage ="Student Age must betwwen 18 and 60")]
        public int age { get; set; }

        [Required(ErrorMessage = "Student Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string email { get; set; }

        [Required(ErrorMessage = "Course is required")]
        public string course { get; set; }   
    }
}
