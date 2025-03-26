using System.Linq;
using Microsoft.AspNetCore.Mvc;
using WebAPIFirst.Helper;
using WebAPIFirst.Model;
using System.Collections.Generic;

namespace WebAPIFirst.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private List<Product> LoadProducts() => FileHelper.ReadFromJsonFile<Database>()?.Products ?? new List<Product>();
        private void SaveProducts(List<Product> products) => FileHelper.WriteToJsonFile(new Database { Products = products });

        [HttpGet("GetAllProducts")]
        public IActionResult Get()
        {
            var products = LoadProducts();
            return Ok(new ApiResponse(1, "All data fetched", products));
        }

        [HttpGet("GetProductsById/{id}")]
        public IActionResult Get(int id)
        {
            var products = LoadProducts();
            var product = products.FirstOrDefault(e => e.Id == id);
            if (product == null)
                return NotFound(new ApiResponse(0, "Product not found", null));

            return Ok(new ApiResponse(1, "Data fetched by ID", product));
        }

        [HttpDelete("DeleteProductById/{id}")]
        public IActionResult Delete(int id)
        {
            var products = LoadProducts();
            var product = products.FirstOrDefault(e => e.Id == id);
            if (product == null)
                return NotFound(new ApiResponse(0, "Product not found", null));

            products.Remove(product);
            SaveProducts(products);

            return Ok(new ApiResponse(1, "Product deleted successfully", product));
        }

        [HttpPost("AddProduct")]
        public IActionResult Post([FromBody] Product newProduct)
        {
            if (newProduct == null || string.IsNullOrWhiteSpace(newProduct.Name) || string.IsNullOrWhiteSpace(newProduct.Description))
                return BadRequest(new ApiResponse(0, "Invalid product data", null));

            var products = LoadProducts();
            newProduct.Id = products.Count > 0 ? products.Max(p => p.Id) + 1 : 1;
            products.Add(newProduct);
            SaveProducts(products);

            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, new ApiResponse(1, "Product added successfully", newProduct));
        }

        [HttpPut("UpdateProductById/{id}")]
        public IActionResult Put(int id, [FromBody] Product updateProduct)
        {
            var products = LoadProducts();
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return NotFound(new ApiResponse(0, "Product not found", null));

            product.Name = updateProduct.Name;
            product.Description = updateProduct.Description;
            product.Price = updateProduct.Price;
            product.Status = updateProduct.Status;

            SaveProducts(products);

            return Ok(new ApiResponse(1, "Product updated successfully", product));
        }
    }
}
