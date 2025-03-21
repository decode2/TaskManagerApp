using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TaskManagerApp.Data;
using TaskManagerApp.Models;
using TaskManagerApp.ViewModels;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Linq;

namespace TaskManagerApp.Controllers
{
    [Authorize]
    public class TasksController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TasksController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: Tasks
        public async Task<IActionResult> Index()
        {
            var userId = _userManager.GetUserId(User);
            var tasks = await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();

            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-3);
            var endOfWeek = today.AddDays(3);

            var weeklyTasks = tasks.Where(t => t.Date.Date >= startOfWeek && t.Date.Date <= endOfWeek)
                                .GroupBy(t => t.Date.Date)
                                .OrderBy(g => g.Key)
                                .ToList();

            var model = new WeeklyTaskViewModel
            {
                WeeklyTasks = weeklyTasks.Select(g => new DailyTaskViewModel
                {
                    Date = g.Key,
                    Tasks = g.ToList()
                }).ToList()
            };

            return View(model);
        }

        // GET: Tasks/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Tasks/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Description,IsCompleted")] TaskModel task)
        {
            if (ModelState.IsValid)
            {
                var userId = _userManager.GetUserId(User);
                if (userId == null)
                {
                    return BadRequest("User ID cannot be null.");
                }
                task.UserId = userId; // Asociar la tarea con el usuario actual
                _context.Add(task);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(task);
        }

        // GET: Tasks/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != _userManager.GetUserId(User))
            {
                return NotFound(); // O Forbid()
            }
            return View(task);
        }

        // POST: Tasks/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Description,IsCompleted")] TaskModel task)
        {
            if (id != task.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingTask = await _context.Tasks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id && t.UserId == _userManager.GetUserId(User));
                    if (existingTask == null)
                    {
                        return NotFound(); // O Forbid()
                    }

                    _context.Update(task);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TaskExists(task.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(task);
        }

        // GET: Tasks/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var task = await _context.Tasks
                .FirstOrDefaultAsync(m => m.Id == id && m.UserId == _userManager.GetUserId(User));
            if (task == null)
            {
                return NotFound(); // O Forbid()
            }

            return View(task);
        }

        // POST: Tasks/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null && task.UserId == _userManager.GetUserId(User))
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        // POST: Tasks/ToggleComplete/5
        [HttpPost]
        public async Task<IActionResult> ToggleComplete(int id, bool isCompleted)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null && task.UserId == _userManager.GetUserId(User))
            {
                task.IsCompleted = isCompleted;
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }
    }
}