namespace WebAPITest.Models.Services
{
    public class ProductService : IProductService
    {
        private readonly List<Product> _products;

        public ProductService()
        {
            _products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Description = "Gaming Laptop", Price = 1200.50m, Status = ProductStatus.Active },
                new Product { Id = 2, Name = "Smartphone", Description = "Latest smartphone", Price = 899.99m, Status = ProductStatus.Active },
                new Product { Id = 3, Name = "Headphones", Description = "Noise-cancelling headphones", Price = 199.99m, Status = ProductStatus.Inactive }
            };
        }

        public List<Product> GetAllProducts() => _products;

        public Product GetProductById(int id) => _products.FirstOrDefault(p => p.Id == id);

        public void AddProduct(Product product)
        {
            product.Id = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(product);
        }

        public bool UpdateProduct(Product product)
        {
            var existingProduct = GetProductById(product.Id);
            if (existingProduct == null) return false;

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.Status = product.Status;

            return true;
        }

        public bool DeleteProduct(int id)
        {
            var product = GetProductById(id);
            if (product == null) return false;

            _products.Remove(product);
            return true;
        }
    }
}
