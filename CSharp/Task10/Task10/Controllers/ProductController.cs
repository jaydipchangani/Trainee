using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Task10.Services;
using System.Collections.Generic;
using Task10.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly IMongoClient _mongoClient;
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<Product> _productCollection;

   
        public ProductController(MongoDbService mongoDbService,IMongoClient mongoClient, IOptions<MongoDbSettings> mongoDbSettings)
        { 
             _mongoDbService = mongoDbService;
            _mongoClient = mongoClient;

            var settings = mongoDbSettings.Value;
            _database = _mongoClient.GetDatabase(settings.DatabaseName);
            _productCollection = _database.GetCollection<Product>(settings.CollectionName);
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            // Fetch all products from the MongoDB collection
            var products = await _productCollection.Find(_ => true).ToListAsync();
            return Ok(products);
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
