using Microsoft.AspNetCore.Mvc;
using WebAPITest.Models.Services;
using WebAPITest.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPITest.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public IActionResult GetAllProducts()
        {
            List<Product> products = _productService.GetAllProducts();
            return Ok(new ApiResponse(1, "Products retrieved successfully", products));
        }

        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            Product product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(new ApiResponse(0, "Product not found", null));

            return Ok(new ApiResponse(1, "Product retrieved successfully", product));
        }

        [HttpPost]
        public IActionResult AddProduct([FromBody] Product product)
        {
            _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, new ApiResponse(1, "Product created successfully", product));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product product)
        {
            product.Id = id;
            bool updated = _productService.UpdateProduct(product);
            if (!updated)
                return NotFound(new ApiResponse(0, "Product not found", null));

            return Ok(new ApiResponse(1, "Product updated successfully", product));
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            bool deleted = _productService.DeleteProduct(id);
            if (!deleted)
                return NotFound(new ApiResponse(0, "Product not found", null));

            return Ok(new ApiResponse(1, "Product deleted successfully", null));
        }
    }
}
