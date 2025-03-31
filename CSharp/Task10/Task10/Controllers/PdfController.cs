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

            try
            {
                byte[] pdfBytes = _pdfService.GeneratePdfFromHtml(htmlPath, cssPath);
                return File(pdfBytes, "application/pdf", "GeneratedReport.pdf");
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
