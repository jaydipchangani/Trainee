using Task10.Models;
namespace Task10.Data
{
    public class ProductData
    {
        public static List<ProductListing> GetProducts()
        {
            return new List<ProductListing>
            {
                new ProductListing { Id = 1, Name = "Laptop", Price = 999.99m, Category = "Electronics" },
                new ProductListing { Id = 2, Name = "Phone", Price = 599.49m, Category = "Electronics" },
                new ProductListing { Id = 3, Name = "Table", Price = 120.00m, Category = "Furniture" }
            };
        }
    }
}
