using DataAccessLayer.Static_Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Task9.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("GetUsers")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUsers()
        {
            return Ok(UserList.Users);
        }
    }
}
