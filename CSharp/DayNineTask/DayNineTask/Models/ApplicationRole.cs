using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;

namespace DayNineTask.Models
{
    [CollectionName("Roles")]  // Define the MongoDB collection name
    public class ApplicationRole : MongoIdentityRole<string>
    {
    }
}
