using InventoryManagement.Data;
using InventoryManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.Controllers
{
    [Route("api/inventory")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetInventory() => Ok(await _context.Inventories.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> AddInventory(Inventory item)
        {
            _context.Inventories.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, Inventory updatedItem)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return NotFound();

            item.Name = updatedItem.Name;
            item.Quantity = updatedItem.Quantity;
            item.Price = updatedItem.Price;
            _context.Update(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var item = await _context.Inventories.FindAsync(id);
            if (item == null) return NotFound();

            _context.Inventories.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
