using Microsoft.AspNetCore.Mvc;
using Practice.Models;

namespace Practice.Controllers
{
    public class ProductController : Controller
    {
        // ✅ In-Memory List to Simulate a Database
        private static List<Product> products = new List<Product>
        {
        };

        // 1️⃣ READ: Display All Products
        public IActionResult Index()
        {
            return View(products);
        }

        // 2️⃣ CREATE: Show Form to Add New Product
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product product)
        {
            if (ModelState.IsValid)
            {
                product.Id = products.Count + 1; // Generate new ID
                products.Add(product);
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // 3️⃣ UPDATE: Show Edit Form
        public IActionResult Edit(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return View(product);
        }

        [HttpPost]
        public IActionResult Edit(Product product)
        {
            var existingProduct = products.FirstOrDefault(p => p.Id == product.Id);
            if (existingProduct == null) return NotFound();

            if (ModelState.IsValid)
            {
                existingProduct.Name = product.Name;
                existingProduct.Price = product.Price;
                existingProduct.Category = product.Category;
                existingProduct.Stock = product.Stock;
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // 4️⃣ DELETE: Show Delete Confirmation Page
        public IActionResult Delete(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return View(product);
        }

        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var product = products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            products.Remove(product);
            return RedirectToAction("Index");
        }
    }
}
