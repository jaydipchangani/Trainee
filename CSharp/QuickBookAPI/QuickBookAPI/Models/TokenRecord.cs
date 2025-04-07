using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class TokenRecord
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("AccessToken")]
    public string AccessToken { get; set; }

    [BsonElement("RefreshToken")]
    public string RefreshToken { get; set; }

    [BsonElement("ExpiresIn")]
    public int ExpiresIn { get; set; }

    [BsonElement("CreatedAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
