using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Phantomhive.Application.Auth.DTOs;
using Phantomhive.Application.Auth.Services;

namespace Phantomhive.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            return Ok(response);
        }

        [HttpPost("sso-login")]
        public async Task<IActionResult> SsoLogin([FromBody] SsoLoginRequest request)
        {
            var response = await _authService.SsoLoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "SSO token verification failed." });
            }

            return Ok(response);
        }
    }
}
