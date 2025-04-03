using InventoryManagementAPI.Data;
using InventoryManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[Route("api/servicecenters")]
[ApiController]
public class ServiceCenterController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServiceCenterController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceCenter>>> GetServiceCenters()
    {
        return await _context.ServiceCenters.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ServiceCenter>> CreateServiceCenter(ServiceCenter serviceCenter)
    {
        serviceCenter.Status = true;
        serviceCenter.ModifiedAt = DateTime.Now;
        _context.ServiceCenters.Add(serviceCenter);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetServiceCenters), new { id = serviceCenter.Id }, serviceCenter);
    }
}
