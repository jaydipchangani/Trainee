using Newtonsoft.Json;

namespace WebAPIFirst.Helper
{
    public class FileHelper
    {
        private static readonly string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "db.json"); // Path to JSON file

        // Read JSON File and Deserialize it
        public static T ReadFromJsonFile<T>()
        {
            if (!File.Exists(filePath))
                return default;

            var json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<T>(json);
        }

        // Serialize and Write Data to JSON File
        public static void WriteToJsonFile<T>(T data)
        {
            var json = JsonConvert.SerializeObject(data, Formatting.Indented);
            File.WriteAllText(filePath, json);
        }
    }
}
