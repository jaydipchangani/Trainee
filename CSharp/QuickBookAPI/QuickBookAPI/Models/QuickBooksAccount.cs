using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class QuickBooksAccount
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("id")]
    public string Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("accountType")]
    public string AccountType { get; set; }

    [BsonElement("accountSubType")]
    public string AccountSubType { get; set; }

    [BsonElement("fullyQualifiedName")]
    public string FullyQualifiedName { get; set; }

    [BsonElement("classification")]
    public string Classification { get; set; }

    [BsonElement("quickBooksId")]
    public string QuickBooksId { get; set; }
}
