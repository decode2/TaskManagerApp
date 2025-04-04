using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskManagerApp.Models;
using TaskManagerApp.Services;
using System.Threading.Tasks;
using TaskManagerApp.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagerApp.Data;

namespace TaskManagerApp.Api
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtService _jwtService;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<ApplicationUser> userManager, JwtService jwtService, ApplicationDbContext context)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.Users.Include(u => u.RefreshTokens).FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials");

            // Remove old tokens
            user.RefreshTokens.Clear();

            var accessToken = _jwtService.GenerateToken(user.Id, user.Email!);
            var refreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshTokens.Add(new RefreshToken { Token = refreshToken, Expires = DateTime.UtcNow.AddDays(7) });
            await _userManager.UpdateAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { token = accessToken });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("Missing refresh token");

            var user = await _context.Users.Include(u => u.RefreshTokens)
                                           .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == refreshToken));

            if (user == null)
                return Unauthorized("Invalid refresh token");

            var storedToken = user.RefreshTokens.First(t => t.Token == refreshToken);

            if (storedToken.Expires < DateTime.UtcNow)
                return Unauthorized("Expired refresh token");

            // Remove all old tokens before issuing a new one
            user.RefreshTokens.Clear();

            var newAccessToken = _jwtService.GenerateToken(user.Id, user.Email!);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            user.RefreshTokens.Add(new RefreshToken { Token = newRefreshToken, Expires = DateTime.UtcNow.AddDays(7) });
            await _context.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { token = newAccessToken });
        }
    }
}
