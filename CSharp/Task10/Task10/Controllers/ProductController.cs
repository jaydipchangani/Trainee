using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Task10.Data;
using Task10.Services;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly CsvService _csvService;

        public ProductController(IConfiguration configuration)
        {
            _csvService = new CsvService(configuration);
        }

        [HttpGet("ExportToCsv")]
        public IActionResult ExportToCsv()
        {
            var products = ProductData.GetProducts();
            string filePath = _csvService.ExportProductsToCsv(products);

            if (filePath.StartsWith("Error"))
                return BadRequest(filePath);

            return Ok(new { Message = "CSV Exported Successfully!", FilePath = filePath });
        }
    }
}
