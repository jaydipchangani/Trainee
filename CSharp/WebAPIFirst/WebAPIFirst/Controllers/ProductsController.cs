using Microsoft.AspNetCore.Mvc;
using WebAPIFirst.Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPIFirst.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        private static List<Product> products = new List<Product>
        {
        new Product { Id = 1, Name = "Laptop", Description = "High-performance laptop", Price = 1200.00m, Status = ProductStatus.Active },
        new Product { Id = 2, Name = "Smartphone", Description = "Latest model smartphone", Price = 800.00m, Status = ProductStatus.Active },
        new Product { Id = 3, Name = "Headphones", Description = "Wireless noise-canceling headphones", Price = 150.00m, Status = ProductStatus.Inactive },
        new Product { Id = 4, Name = "Tablet", Description = "10-inch touchscreen tablet", Price = 350.00m, Status = ProductStatus.Active },
        new Product { Id = 5, Name = "Smartwatch", Description = "Fitness and notification smartwatch", Price = 200.00m, Status = ProductStatus.Inactive },
        new Product { Id = 6, Name = "Gaming Mouse", Description = "High-precision gaming mouse", Price = 75.00m, Status = ProductStatus.Active },
        new Product { Id = 7, Name = "Keyboard", Description = "Mechanical gaming keyboard", Price = 120.00m, Status = ProductStatus.Inactive },
        new Product { Id = 8, Name = "Monitor", Description = "27-inch 4K UHD monitor", Price = 450.00m, Status = ProductStatus.Active },
        new Product { Id = 9, Name = "Webcam", Description = "1080p HD webcam with microphone", Price = 60.00m, Status = ProductStatus.Active },
        new Product { Id = 10, Name = "Printer", Description = "Wireless all-in-one printer", Price = 250.00m, Status = ProductStatus.Active },
        new Product { Id = 11, Name = "External Hard Drive", Description = "2TB portable external hard drive", Price = 90.00m, Status = ProductStatus.Active },
        new Product { Id = 12, Name = "Wireless Router", Description = "Dual-band Wi-Fi 6 router", Price = 180.00m, Status = ProductStatus.Inactive },
        new Product { Id = 13, Name = "VR Headset", Description = "Immersive virtual reality headset", Price = 300.00m, Status = ProductStatus.Inactive }
        };

        [HttpGet]
        public IActionResult GetProducts()
        {
            return Ok(products);
        }

        [HttpGet("{name}")]
        public IActionResult GetProduct(string name)
        {
            var product = products.FirstOrDefault(e => e.Name == name);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = products.FirstOrDefault(e => e.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }
            products.Remove(product);

            return Ok(new { message = "Product Deleted" });
        }

    }
}
