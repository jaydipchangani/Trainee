using System.Data;
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
        };

        [HttpGet("GetAllProducts")]
        public IActionResult Get()
        {
            return Ok(new ApiResponse(1,"All data fetched",products));
        }

        [HttpGet("GetProductsById")]
        public IActionResult Get(int id)
        {
            var product = products.FirstOrDefault(e => e.Id == id);
            if (product == null)
                return NotFound(new ApiResponse(0, "Product not found",product));

            return Ok(new ApiResponse(1,"Data Fetched by name", product) );
        }

        [HttpDelete("DeleteProductById")]
        public IActionResult Delete(int id)
        {
            var product = products.FirstOrDefault(e => e.Id == id);
            if (product == null)
            {
                return NotFound(new ApiResponse(0, "Product not found", product));
            }
            products.Remove(product);

            return Ok(new ApiResponse(1, "Product Deleted Successfully", product));
        }

        [HttpPost("AddProduct")]
        public IActionResult Post([FromBody] Product newProduct)
        {
            if (newProduct == null || string.IsNullOrWhiteSpace(newProduct.Name) || string.IsNullOrWhiteSpace(newProduct.Description))
                return BadRequest(new ApiResponse(0, "Invalid Product data", newProduct));

            newProduct.Id = products.Count > 0 ? products.Max(p => p.Id) + 1 : 1;
            products.Add(newProduct);

            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, new ApiResponse(1, "Product added successfully", newProduct));
        }

        [HttpPut("UpdateProductById")]
        public IActionResult Put(int id, [FromBody] Product updateProduct)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound(new ApiResponse(0, "Product not found",product));
            }

            product.Name = updateProduct.Name;
            product.Description = updateProduct.Description;
            product.Price = updateProduct.Price;
            product.Status = updateProduct.Status;

            return Ok(new ApiResponse(1, "Product updated successfully", product));
        }
    }
}
