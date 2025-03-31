using DataAccessLayer.Static_Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Task9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        [HttpGet("GetProject")]
        [Authorize(Roles = "Admin, Manager")]
        public IActionResult GetProject()
        {
            return Ok(ProjectList.Projects);
        }
    }
}
