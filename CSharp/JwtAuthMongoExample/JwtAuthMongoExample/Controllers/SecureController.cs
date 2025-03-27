using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JwtAuthMongoExample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SecureController : ControllerBase
    {
        [HttpGet("user-info")]
        public IActionResult GetUserInfo()
        {
            return Ok(new { Message = "This is a secured endpoint." });
        }
    }
}
