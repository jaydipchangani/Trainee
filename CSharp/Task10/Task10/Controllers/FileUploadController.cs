using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly string _uploadFolder = "UploadFiles";

        [HttpPost("UploadSingleFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No File Upload");
            }
                try
                {
                    string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), _uploadFolder);
                    if (!Directory.Exists(uploadPath))
                    {
                        Directory.CreateDirectory(uploadPath);
                    }

                string[] allowedExtensions = { ".jpg", ".png", ".pdf" };
                if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
                {
                    return BadRequest("Only .jpg, .png, and .pdf files are allowed.");
                }

                // Generate a unique filename
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    string filePath = Path.Combine(uploadPath, fileName);

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    return Ok(new { message = "File uploaded successfully!", filePath });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
                }
            }

        [HttpPost("UploadFileWithData")]
        public async Task<IActionResult> UploadFileWithData()
        {
            return Ok(new { message = "Test" });
        }
    }
}
