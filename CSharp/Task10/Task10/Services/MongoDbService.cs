using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Task10.Models;

namespace Task10.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<Product> _collection;

        public MongoDbService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<Product>(settings.Value.CollectionName);
        }

        public async Task InsertProduct(Product product)
        {
            await _collection.InsertOneAsync(product);
        }
    }
}


