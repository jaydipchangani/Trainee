using InventoryManagementAPI.Data;
using InventoryManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagementAPI.Controllers
{
    [Route("api/servicecenters")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ServiceCenterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServiceCenterController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var centers = await _context.ServiceCenters.ToListAsync();
            return Ok(centers);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ServiceCenter serviceCenter)
        {
            serviceCenter.Status = 1;
            _context.ServiceCenters.Add(serviceCenter);
            await _context.SaveChangesAsync();
            return Ok("Service Center created.");
        }
    }
}
