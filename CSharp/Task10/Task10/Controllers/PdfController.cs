using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Task10.Services;

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly PdfGeneratorService _pdfService;

        public PdfController()
        {
            _pdfService = new PdfGeneratorService();
        }

        [HttpGet("GeneratePdf")]
        public IActionResult GeneratePdf()
        {
            string htmlPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "template.html");
            string cssPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "styles.css");
            string customSavePath = @"C:\Trainee_new\CSharp\Task10\Task10\Uploads\GeneratedReport.pdf";
            try
            {
                byte[] pdfBytes = _pdfService.GeneratePdfFromHtml(htmlPath, cssPath);

                // Ensure the directory exists before saving
                string directory = Path.GetDirectoryName(customSavePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Save the PDF to the custom path
                System.IO.File.WriteAllBytes(customSavePath, pdfBytes);

                return Ok(new { Message = "PDF saved successfully", FilePath = customSavePath });
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
