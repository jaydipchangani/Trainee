using Microsoft.EntityFrameworkCore;

namespace QuickBookAPI.Data
{
    public class QuickBooksDbContext : DbContext
    {
        public QuickBooksDbContext(DbContextOptions<QuickBooksDbContext> options) : base(options) { }

        public DbSet<QuickBooksAccount> QuickBooksAccounts { get; set; }
    }
}
