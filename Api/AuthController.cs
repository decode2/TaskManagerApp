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
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials");

            // Remove all existing tokens for this user
            var existingTokens = await _context.RefreshTokens.Where(rt => rt.UserId == user.Id).ToListAsync();
            _context.RefreshTokens.RemoveRange(existingTokens);

            var accessToken = _jwtService.GenerateToken(user.Id, user.Email!);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Add new token
            var newToken = new RefreshToken 
            { 
                Token = refreshToken, 
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };
            _context.RefreshTokens.Add(newToken);
            
            await _context.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Changed to false for local development
                SameSite = SameSiteMode.Lax, // Changed to Lax
                Expires = DateTimeOffset.UtcNow.AddDays(7)
                // Removed Domain for local development
            });

            return Ok(new { token = accessToken, email = user.Email! });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("Missing refresh token");

            // Find the token directly
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null || storedToken.Expires < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            var user = storedToken.User;
            if (user == null)
                return Unauthorized("Invalid refresh token");

            var newAccessToken = _jwtService.GenerateToken(user.Id, user.Email!);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            // Delete the old token first
            _context.RefreshTokens.Remove(storedToken);
            await _context.SaveChangesAsync();

            // Add the new token
            var newToken = new RefreshToken 
            { 
                Token = newRefreshToken, 
                Expires = DateTime.UtcNow.AddDays(7),
                UserId = user.Id
            };
            _context.RefreshTokens.Add(newToken);
            await _context.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { token = newAccessToken, email = user.Email! });
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }
    }
}
