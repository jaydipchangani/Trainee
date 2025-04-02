using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MyBackend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}
