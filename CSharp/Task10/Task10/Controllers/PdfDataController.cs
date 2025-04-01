using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Task10.Controllers
{
    [Route("api/pdfdata")]
    [ApiController]
    public class PdfDataController : ControllerBase
    {
        private readonly IMongoCollection<ProductList> _productCollection;

        public PdfDataController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("FileUploadDB");
            _productCollection = database.GetCollection<ProductList>("ProductData");
        }

        [HttpGet("generate")]
        public async Task<IActionResult> GeneratePdf()
        {
            var products = await _productCollection.Find(_ => true).ToListAsync();

            // Generate PDF
            byte[] pdfBytes = GenerateProductPdf(products);

            // Return PDF as a downloadable file
            return File(pdfBytes, "application/pdf", "ProductCatalog.pdf");
        }

        private byte[] GenerateProductPdf(List<ProductList> products)
        {
            QuestPDF.Settings.License = LicenseType.Community; // Required for QuestPDF

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.Header().Text("Product Catalog").FontSize(20).Bold().AlignCenter();

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(50);  // ID Column
                            columns.RelativeColumn(2);   // Product Name
                            columns.RelativeColumn(3);   // Description
                            columns.RelativeColumn(3);   // URL
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("ID").Bold();
                            header.Cell().Text("Product Name").Bold();
                            header.Cell().Text("Description").Bold();
                            header.Cell().Text("URL").Bold();
                        });

                        foreach (var product in products)
                        {
                            table.Cell().Text(product.Id.ToString());
                            table.Cell().Text(product.ProductName);
                            table.Cell().Text(product.Description);
                            table.Cell().Text(product.Url);
                        }
                    });
                });
            }).GeneratePdf();
        }
    }

    public class ProductList
    {
        public string Id { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
    }
}
