using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc;

namespace Task10.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [FromForm]
        public string ProductName { get; set; }
        [FromForm]
        public string ProductDescription { get; set; }

        
        public string? FilePath { get; set; }
        [FromForm]
       
        public IFormFile File { get; set; }


    }
}
