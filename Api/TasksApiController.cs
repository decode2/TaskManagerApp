using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagerApp.Data;
using TaskManagerApp.Models;
using TaskManagerApp.Dtos;
using TaskManagerApp.ViewModels;

namespace TaskManagerApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksApiController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;

        private string GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("⚠️  No userId in JWT claims!");
                throw new InvalidOperationException("User is not authenticated");
            }

            Console.WriteLine($"✅ Authenticated user: {userId}");
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskModel>>> GetTasks()
        {
            var userId = GetUserId();
            return await _context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TaskModel>> CreateTask(CreateTaskDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var task = new TaskModel{
                Title = dto.Title,
                Date = dto.Date,
                IsCompleted = false,
                UserId = GetUserId()
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskModel>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != GetUserId()) return NotFound();
            return task;
        }

        [HttpGet("week")]
        public async Task<ActionResult<WeeklyTaskViewModel>> GetWeeklyTasks()
        {
            var userId = GetUserId();

            var startDate = DateTime.Today;
            var endDate = startDate.AddDays(7);

            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId && t.Date >= startDate && t.Date < endDate)
                .ToListAsync();

            var grouped = tasks
                .GroupBy(t => t.Date.Date)
                .Select(g => new DailyTaskViewModel
                {
                    Date = g.Key,
                    Tasks = g.ToList()
                })
                .OrderBy(g => g.Date)
                .ToList();

            return Ok(new WeeklyTaskViewModel
            {
                WeeklyTasks = grouped
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto updatedTask)
        {
            if (id != updatedTask.Id) return BadRequest();
            
            var existing = await _context.Tasks.FindAsync(id);
            if (existing == null || existing.UserId != GetUserId()) return NotFound();

            existing.Title = updatedTask.Title;
            existing.IsCompleted = updatedTask.IsCompleted;
            existing.Date = updatedTask.Date;
            existing.RecurrenceType = updatedTask.RecurrenceType;
            existing.RecurrenceInterval = updatedTask.RecurrenceInterval;
            existing.RecurrenceCount = updatedTask.RecurrenceCount;
            existing.RecurrenceIndex = updatedTask.RecurrenceIndex;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/toggle-completion")]
        public async Task<IActionResult> ToggleCompletion(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != GetUserId()) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != GetUserId()) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
