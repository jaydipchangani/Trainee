using System.ComponentModel.DataAnnotations;

namespace Practice.Models
{
    public class Product
    {
        public int Id { get; set; } // Unique Identifier

        [Required(ErrorMessage = "Product Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(1, 100000, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }

        [Required(ErrorMessage = "Stock Quantity is required")]
        public int Stock { get; set; }


    }
}
