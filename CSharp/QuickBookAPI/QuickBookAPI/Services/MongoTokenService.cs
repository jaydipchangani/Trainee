using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

public class MongoTokenService
{
    private readonly IMongoCollection<TokenRecord> _tokens;

    public MongoTokenService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        var database = client.GetDatabase(config["MongoDB:Database"]);
        _tokens = database.GetCollection<TokenRecord>("QuickBooksTokens");
    }

    public async Task SaveTokenAsync(TokenRecord record)
    {
        await _tokens.InsertOneAsync(record);
    }
}
