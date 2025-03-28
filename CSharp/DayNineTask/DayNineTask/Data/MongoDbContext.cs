using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using DayNineTask.Models;

namespace DayNineTask.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<ApplicationUser> _users;

        public MongoDbContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration["MongoDb:ConnectionString"]);
            _database = client.GetDatabase(configuration["MongoDb:DatabaseName"]);
            _users = _database.GetCollection<ApplicationUser>("Users");
        }

        public IMongoCollection<ApplicationUser> Users => _users;
    }
}
