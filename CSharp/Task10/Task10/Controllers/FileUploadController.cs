using Microsoft.AspNetCore.Mvc;
using Task10.Models;
using Task10.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Task10.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase

    {
        private readonly MongoDbService _mongoDbService;
        private readonly string _uploadFolder = "UploadFiles";


        public FileUploadController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }


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
        public async Task<IActionResult> UploadFileWithData([FromForm] Product model)
        {
            if (model.File == null || model.File.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                string uploadFile = Path.Combine(Directory.GetCurrentDirectory(), _uploadFolder);
                if (!Directory.Exists(uploadFile))
                {
                    Directory.CreateDirectory(uploadFile);
                }

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.File.FileName);
                string filePath = Path.Combine(uploadFile, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream);
                }

                var fileData = new Product
                {
                    ProductName = model.ProductName,
                    ProductDescription = model.ProductDescription,
                    FilePath = filePath
                };

                await _mongoDbService.InsertProduct(fileData);

                return Ok(new
                {
                    message = "File uploaded successfully!",
                    filePath,
                    title = model.ProductName,
                    description = model.ProductDescription
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }

        [HttpPost("UploadMultipleFiles")]
        public async Task<IActionResult> UploadMultipleFiles(
        [FromForm] string title,
        [FromForm] string description,
        [FromForm] IFormFileCollection files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files uploaded.");
            }

            try
            {
                string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), _uploadFolder);
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath); // Ensure folder exists
                }

                List<string> filePaths = new List<string>();

                foreach (var file in files)
                {
                    string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    string filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    filePaths.Add(filePath);
                }

                return Ok(new
                {
                    message = "Files uploaded successfully!",
                    storedFilePaths = filePaths,
                    title,
                    description
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading files", error = ex.Message });
            }
        }




    }
}
