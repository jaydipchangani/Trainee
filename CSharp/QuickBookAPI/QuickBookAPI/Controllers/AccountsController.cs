using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuickBookAPI.Services;

namespace QuickBookAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncAccounts()
        {
            await _accountService.SyncAccountsAsync();
            return Ok(new { message = "Accounts synced successfully." });
        }
    }
}
