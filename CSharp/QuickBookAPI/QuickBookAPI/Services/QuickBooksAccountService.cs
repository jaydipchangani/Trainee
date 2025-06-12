using MongoDB.Driver;
 using QuickBookAPI.Data;
using Microsoft.EntityFrameworkCore;

public class QuickBooksAccountService
{
    private readonly QuickBooksDbContext _dbContext;

    public QuickBooksAccountService(QuickBooksDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task SaveAccountsAsync(List<QuickBooksAccount> accounts)
    {
        await _dbContext.QuickBooksAccounts.AddRangeAsync(accounts);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<QuickBooksAccount>> GetAccountsAsync()
    {
        return await _dbContext.QuickBooksAccounts.ToListAsync();
    }
}
