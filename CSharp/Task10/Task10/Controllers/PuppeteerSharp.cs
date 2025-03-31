using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PuppeteerSharp.Media;
using PuppeteerSharp;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuppeteerSharp : ControllerBase
    {
        private readonly string _pdfSavePath = "wwwroot/pdfs"; // Path to save PDFs

        public PuppeteerSharp()
        {
            if (!Directory.Exists(_pdfSavePath))
            {
                Directory.CreateDirectory(_pdfSavePath);
            }
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GeneratePdf([FromBody] PdfRequest request)
        {
            try
            {
                using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = true,
                    ExecutablePath = "/path/to/chromium" // Optional: specify the path if needed
                });




        
                using var page = await browser.NewPageAsync();

                // Set HTML content
                await page.SetContentAsync(request.HtmlContent);

                // Generate PDF
                string filePath = Path.Combine(_pdfSavePath, $"{request.FileName}.pdf");
                await page.PdfAsync(filePath, new PdfOptions
                {
                    Format = PaperFormat.A4,
                    PrintBackground = true
                });

                return Ok(new { Message = "PDF generated successfully", FilePath = filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}


    public class PdfRequest
    {
        public string HtmlContent { get; set; }
        public string FileName { get; set; }
    }