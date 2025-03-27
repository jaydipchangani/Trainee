using Microsoft.AspNetCore.Mvc;
using JwtAuthMongoExample.Services;
using System.Threading.Tasks;
using JwtAuthMongoExample.Model;

namespace JwtAuthMongoExample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }

            try
            {
                var token = await _userService.RegisterAsync(model.Username, model.Password);
                return Ok(new { Message = "User Created" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // Return validation errors if the model is invalid
            }

            try
            {
                var token = await _userService.LoginAsync(model.Username, model.Password);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }

   
}
