using System.Collections.Generic;
using System.Threading.Tasks;
using QuickBookAPI.Models; // Replace with the actual namespace

public interface IMongoService
{
    Task SaveAccountsAsync(List<QuickBooksAccount> accounts);

    Task<List<QuickBooksAccount>> GetAccountsAsync();
}
