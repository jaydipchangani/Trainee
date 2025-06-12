using System.ComponentModel.DataAnnotations;

namespace taskFour.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required( ErrorMessage = "Product name required")]
        [StringLength(30,MinimumLength =3,ErrorMessage = "Product name must be between 3 and 300 characters")]
        [RegularExpression(@"^(?!\s+$)[A-Za-z\s]+$", ErrorMessage = "Only alphabets and spaces are allowed. Product Name cannot be only spaces.")]
        public string ProductName { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "Product Description must be between 3 and 50 characters")]
        public string ProductDescription { get; set; }

        [Required(ErrorMessage = "Product Category required")]
        public string ProductCategory { get; set; }

        [Required(ErrorMessage = "Product Quantity required")]
        [Range(1,20, ErrorMessage = "Student Age must betwwen 18 and 60")]
        public int Qty { get; set; }

       
    }
}
