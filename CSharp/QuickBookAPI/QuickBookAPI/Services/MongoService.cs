using MongoDB.Driver;
using QuickBookAPI.Models; // Replace with the actual namespace
using System.Collections.Generic;
using System.Threading.Tasks;

public class MongoService : IMongoService
{
    private readonly IMongoCollection<QuickBooksAccount> _accountsCollection;

    public MongoService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        var database = client.GetDatabase(config["MongoDB:Database"]);
        _accountsCollection = database.GetCollection<QuickBooksAccount>("QuickBooksAccounts");
    }

    public async Task SaveAccountsAsync(List<QuickBooksAccount> accounts)
    {
        await _accountsCollection.InsertManyAsync(accounts);
    }

    public async Task<List<QuickBooksAccount>> GetAccountsAsync()
    {
        return await _accountsCollection.Find(_ => true).ToListAsync();
    }
}
