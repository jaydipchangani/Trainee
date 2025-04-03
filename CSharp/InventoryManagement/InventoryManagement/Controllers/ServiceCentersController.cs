using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ServiceCentersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServiceCentersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/servicecenters (Admin Only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ServiceCenter>>> GetServiceCenters()
    {
        return await _context.ServiceCenters.ToListAsync();
    }

    // POST: api/servicecenters (Admin Only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateServiceCenter([FromBody] CreateServiceCenterDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var serviceCenter = new ServiceCenter
        {
            Name = model.Name,
            PrimaryContactName = model.PrimaryContactName,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address
        };

        _context.ServiceCenters.Add(serviceCenter);
        await _context.SaveChangesAsync();

        return Ok("Service Center created successfully!");
    }
}
