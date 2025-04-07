using MongoDB.Driver;

public class QuickBooksAccountService
{
    private readonly IMongoCollection<QuickBooksAccount> _collection;
    private readonly IMongoDatabase _database;


    public QuickBooksAccountService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _collection = database.GetCollection<QuickBooksAccount>("QuickBooksAccounts");
    }

    public async Task SaveAccountsAsync(List<QuickBooksAccount> accounts)
    {
        var collection = _database.GetCollection<QuickBooksAccount>("QuickBooksAccounts");
        await collection.InsertManyAsync(accounts);
    }


    public async Task<List<QuickBooksAccount>> GetAccountsAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }
}
