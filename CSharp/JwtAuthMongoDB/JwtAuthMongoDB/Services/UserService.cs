using MongoDB.Driver;
using JwtAuthMongoDB.Models;
using Microsoft.Extensions.Options;

namespace JwtAuthMongoDB.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        public UserService(IConfiguration config) 
        {
            var connectionString = config["MongoDB:ConnectionURI"];
            var databaseName = config["MongoDB:DatabaseName"];
            var collectionName = config["MongoDB:UserCollection"];

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentException("MongoDB ConnectionString is missing in configuration.");
            if (string.IsNullOrEmpty(databaseName))
                throw new ArgumentException("MongoDB DatabaseName is missing in configuration.");
            if (string.IsNullOrEmpty(collectionName))
                throw new ArgumentException("MongoDB CollectionName is missing in configuration.");

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _users = database.GetCollection<User>(collectionName);
        }

        public async Task<User?> GetUserByUsernameAsync(string username) =>
        await _users.Find(u => u.UserName == username).FirstOrDefaultAsync();

        public async Task CreateUserAsync(User user) =>
        await _users.InsertOneAsync(user);
    }
}
