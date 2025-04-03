using Microsoft.EntityFrameworkCore;
using InventoryManagementAPI.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace InventoryManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceCenter> ServiceCenters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.ServiceCenter)
                .WithMany()
                .HasForeignKey(u => u.ServiceCenterId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
