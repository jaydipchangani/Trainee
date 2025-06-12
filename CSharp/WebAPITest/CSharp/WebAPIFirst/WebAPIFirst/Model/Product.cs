namespace WebAPIFirst.Model
{
    public class Product
    {
     
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
         public ProductStatus Status { get; set; }
    }

    public enum ProductStatus
    {
        Active,
        Inactive,
    }
}
