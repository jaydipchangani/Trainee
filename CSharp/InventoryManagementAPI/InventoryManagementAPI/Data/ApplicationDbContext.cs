using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Models;

namespace InventoryManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceCenter> ServiceCenters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensure ServiceCenter is not automatically created
            modelBuilder.Entity<User>()
                .HasOne(u => u.ServiceCenter)
                .WithMany() // Changed from WithOne() to WithMany()
                .HasForeignKey(u => u.ServiceCenterId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict); //  Prevent automatic ServiceCenter creation


            modelBuilder.Entity<ServiceCenter>().ToTable("ServiceCenters");
        }
    }
}
