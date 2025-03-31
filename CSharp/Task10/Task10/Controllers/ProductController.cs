using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Task10.Services;
using System.Collections.Generic;
using Task10.Models;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;

        public ProductController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpGet("ExportToCsv")]
        public async Task<IActionResult> ExportToCsv()
        {
            string result = await _mongoDbService.ExportProductsToCsv();

            if (result.Contains("Error"))
                return BadRequest(result);

            return Ok(new { Message = "CSV Exported Successfully!", FilePath = result });
        }
    }
}
