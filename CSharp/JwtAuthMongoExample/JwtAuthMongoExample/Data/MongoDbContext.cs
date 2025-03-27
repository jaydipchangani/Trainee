using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using JwtAuthMongoExample.Models;

namespace JwtAuthMongoExample.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration.GetValue<string>("MongoDb:ConnectionString");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentNullException(nameof(connectionString), "MongoDB connection string is not configured.");
            }

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(configuration.GetValue<string>("MongoDb:Database"));
        }
    }
}
