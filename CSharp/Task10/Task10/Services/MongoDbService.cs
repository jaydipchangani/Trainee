using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Task10.Models;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Task10.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<Product> _collection;
        private readonly string _csvSavePath;

        public MongoDbService(IOptions<MongoDbSettings> settings, IOptions<CsvSettings> csvSettings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<Product>(settings.Value.CollectionName);

            _csvSavePath = csvSettings.Value.SavePath;
        }

        public async Task InsertProduct(Product product)
        {
            await _collection.InsertOneAsync(product);
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<string> ExportProductsToCsv()
        {
            var products = await GetAllProducts();

            if (products == null || products.Count == 0)
                return "No products found.";

            try
            {
                // Ensure directory exists
                string directory = Path.GetDirectoryName(_csvSavePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Write data to CSV
                using (var writer = new StreamWriter(_csvSavePath))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(products);
                }

                return $"CSV file saved at: {_csvSavePath}";
            }
            catch (Exception ex)
            {
                return $"Error exporting CSV: {ex.Message}";
            }
        }
    }
}
