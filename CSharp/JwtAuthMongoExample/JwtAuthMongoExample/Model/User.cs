using MongoDB.Bson.Serialization.Attributes;
using System;

namespace JwtAuthMongoExample.Models
{
    public class User
    {
        [BsonId]  // Mark as the primary key in MongoDB
        [BsonRepresentation(MongoDB.Bson.BsonType.String)] // Store GUID as a string
        public Guid Id { get; set; }

        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
    }
}
