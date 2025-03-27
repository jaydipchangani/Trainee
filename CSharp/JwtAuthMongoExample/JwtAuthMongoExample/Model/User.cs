using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace JwtAuthMongoExample.Models
{
    public class User
    {
        [BsonId] 
        [BsonRepresentation(MongoDB.Bson.BsonType.String)] 
        public Guid Id { get; set; }
        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string Role { get; set; }
    }
}
