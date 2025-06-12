using Newtonsoft.Json;

namespace WebAPIFirst.Helper
{
    public class FileHelper
    {
        private static readonly string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "db.json");


        public static T ReadFromJsonFile<T>()
        {
            if (!File.Exists(filePath))
                return default;

            var json = File.ReadAllText(filePath);
            return JsonConvert.DeserializeObject<T>(json);      //JSON str ne object ma convert kre 
        }

        public static void WriteToJsonFile<T>(T data)
        {
            var json = JsonConvert.SerializeObject(data, Formatting.Indented);      // json convert 
            File.WriteAllText(filePath, json);
        }
    }
}
