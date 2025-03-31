using CsvHelper;
using System.Globalization;
using Task10.Models;

namespace Task10.Services
{
    public class CsvService
    {
        private readonly string _csvSavePath;

        public CsvService(IConfiguration configuration)
        {
            _csvSavePath = configuration["CsvSettings:SavePath"];
        }

        public string ExportProductsToCsv(List<ProductListing> products)
        {
            try
            {
                // Ensure directory exists
                string directory = Path.GetDirectoryName(_csvSavePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Write to CSV
                using (var writer = new StreamWriter(_csvSavePath))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(products);
                }

                return _csvSavePath;
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
    }
}
