using DinkToPdf.Contracts;
using DinkToPdf;

namespace Task10.Services
{
    public class PdfGeneratorService
    {
        private readonly IConverter _converter;

        public PdfGeneratorService()
        {
            var context = new CustomAssemblyLoadContext();
            _converter = new BasicConverter(new PdfTools());
        }

        public byte[] GeneratePdfFromHtml(string htmlFilePath, string cssFilePath)
        {
            if (!File.Exists(htmlFilePath) || !File.Exists(cssFilePath))
            {
                throw new FileNotFoundException("HTML or CSS file not found.");
            }

            // Read HTML and CSS files
            string htmlContent = File.ReadAllText(htmlFilePath);
            string cssContent = File.ReadAllText(cssFilePath);

            // Embed CSS into HTML
            string fullHtml = $"<html><head><style>{cssContent}</style></head><body>{htmlContent}</body></html>";

            // Convert HTML to PDF
            var doc = new HtmlToPdfDocument()
            {
                GlobalSettings = new GlobalSettings()
                {
                    ColorMode = ColorMode.Color,
                    Orientation = Orientation.Portrait,
                    PaperSize = PaperKind.A4
                },
                Objects = { new ObjectSettings() { HtmlContent = fullHtml } }
            };

            return _converter.Convert(doc);
        }
    }
}
public class CustomAssemblyLoadContext : System.Runtime.Loader.AssemblyLoadContext
{
    public CustomAssemblyLoadContext() : base(isCollectible: true) { }
}