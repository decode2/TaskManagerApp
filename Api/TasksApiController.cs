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
    [Route("api/tasks")]
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

            // Validate that the date is in the future
            if (dto.DateAsDateTime <= DateTime.Now)
            {
                return BadRequest("Date must be in the future");
            }

            // Validate project exists and belongs to user
            if (dto.ProjectId.HasValue)
            {
                var project = await _context.Projects
                    .FirstOrDefaultAsync(p => p.Id == dto.ProjectId && p.UserId == GetUserId());
                if (project == null)
                {
                    return BadRequest("Project not found or access denied");
                }
            }

            // Validate parent task exists and belongs to user
            if (dto.ParentTaskId.HasValue)
            {
                var parentTask = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Id == dto.ParentTaskId && t.UserId == GetUserId());
                if (parentTask == null)
                {
                    return BadRequest("Parent task not found or access denied");
                }
            }

            var task = new TaskModel{
                Title = dto.Title,
                Date = dto.DateAsDateTime,
                IsCompleted = false,
                UserId = GetUserId(),
                Priority = dto.Priority,
                Category = dto.Category,
                Description = dto.Description,
                Tags = dto.Tags,
                IsArchived = false,
                ProjectId = dto.ProjectId,
                ParentTaskId = dto.ParentTaskId,
                EstimatedMinutes = dto.EstimatedMinutes,
                DueDate = dto.DueDateAsDateTime,
                CreatedAt = DateTime.UtcNow
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
            existing.Priority = updatedTask.Priority;
            existing.Category = updatedTask.Category;
            existing.Description = updatedTask.Description;
            existing.Tags = updatedTask.Tags;
            existing.IsArchived = updatedTask.IsArchived;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/toggle-completion")]
        public async Task<IActionResult> ToggleCompletion(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != GetUserId()) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            task.UpdatedAt = DateTime.UtcNow;
            
            if (task.IsCompleted)
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                task.CompletedAt = null;
            }

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

        // New endpoints for advanced features

        [HttpGet("{id}/subtasks")]
        public async Task<ActionResult<IEnumerable<TaskModel>>> GetSubtasks(int id)
        {
            var userId = GetUserId();
            var subtasks = await _context.Tasks
                .Where(t => t.ParentTaskId == id && t.UserId == userId)
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();

            return Ok(subtasks);
        }

        [HttpGet("{id}/dependencies")]
        public async Task<ActionResult<IEnumerable<TaskDependencyResponseDto>>> GetDependencies(int id)
        {
            var userId = GetUserId();
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != userId) return NotFound();

            var dependencies = await _context.TaskDependencies
                .Include(td => td.DependsOnTask)
                .Where(td => td.TaskId == id)
                .Select(td => new TaskDependencyResponseDto
                {
                    Id = td.Id,
                    TaskId = td.TaskId,
                    TaskTitle = task.Title,
                    DependsOnTaskId = td.DependsOnTaskId,
                    DependsOnTaskTitle = td.DependsOnTask.Title,
                    IsBlocked = !td.DependsOnTask.IsCompleted,
                    CreatedAt = td.CreatedAt
                })
                .ToListAsync();

            return Ok(dependencies);
        }

        [HttpPost("{id}/dependencies")]
        public async Task<ActionResult<TaskDependencyModel>> AddDependency(int id, CreateTaskDependencyDto dto)
        {
            var userId = GetUserId();
            
            // Validate both tasks exist and belong to user
            var task = await _context.Tasks.FindAsync(id);
            var dependsOnTask = await _context.Tasks.FindAsync(dto.DependsOnTaskId);
            
            if (task == null || task.UserId != userId) return NotFound("Task not found");
            if (dependsOnTask == null || dependsOnTask.UserId != userId) return NotFound("Depends on task not found");

            // Prevent circular dependencies
            if (id == dto.DependsOnTaskId) return BadRequest("Task cannot depend on itself");

            // Check for circular dependency
            var wouldCreateCircular = await CheckCircularDependency(id, dto.DependsOnTaskId);
            if (wouldCreateCircular) return BadRequest("This dependency would create a circular reference");

            // Check if dependency already exists
            var existingDependency = await _context.TaskDependencies
                .FirstOrDefaultAsync(td => td.TaskId == id && td.DependsOnTaskId == dto.DependsOnTaskId);
            
            if (existingDependency != null) return BadRequest("Dependency already exists");

            var dependency = new TaskDependencyModel
            {
                TaskId = id,
                DependsOnTaskId = dto.DependsOnTaskId,
                CreatedAt = DateTime.UtcNow
            };

            _context.TaskDependencies.Add(dependency);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDependencies), new { id }, dependency);
        }

        [HttpDelete("dependencies/{dependencyId}")]
        public async Task<IActionResult> RemoveDependency(int dependencyId)
        {
            var userId = GetUserId();
            var dependency = await _context.TaskDependencies
                .Include(td => td.Task)
                .FirstOrDefaultAsync(td => td.Id == dependencyId && td.Task.UserId == userId);

            if (dependency == null) return NotFound();

            _context.TaskDependencies.Remove(dependency);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/time-entries")]
        public async Task<ActionResult<IEnumerable<TimeEntryResponseDto>>> GetTimeEntries(int id)
        {
            var userId = GetUserId();
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != userId) return NotFound();

            var timeEntries = await _context.TimeEntries
                .Where(te => te.TaskId == id && te.UserId == userId)
                .OrderByDescending(te => te.StartTime)
                .Select(te => new TimeEntryResponseDto
                {
                    Id = te.Id,
                    TaskId = te.TaskId,
                    TaskTitle = task.Title,
                    StartTime = te.StartTime,
                    EndTime = te.EndTime,
                    DurationMinutes = te.DurationMinutes,
                    Description = te.Description,
                    CreatedAt = te.CreatedAt
                })
                .ToListAsync();

            return Ok(timeEntries);
        }

        [HttpPost("{id}/time-entries/start")]
        public async Task<ActionResult<TimeEntryModel>> StartTimeTracking(int id, StartTimeTrackingDto dto)
        {
            var userId = GetUserId();
            var task = await _context.Tasks.FindAsync(id);
            if (task == null || task.UserId != userId) return NotFound();

            // Check if there's already an active time entry for this task
            var activeEntry = await _context.TimeEntries
                .FirstOrDefaultAsync(te => te.TaskId == id && te.UserId == userId && te.EndTime == null);

            if (activeEntry != null) return BadRequest("Time tracking is already active for this task");

            var timeEntry = new TimeEntryModel
            {
                TaskId = id,
                UserId = userId,
                StartTime = DateTime.UtcNow,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.TimeEntries.Add(timeEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimeEntries), new { id }, timeEntry);
        }

        [HttpPatch("time-entries/{timeEntryId}/stop")]
        public async Task<ActionResult<TimeEntryModel>> StopTimeTracking(int timeEntryId)
        {
            var userId = GetUserId();
            var timeEntry = await _context.TimeEntries
                .FirstOrDefaultAsync(te => te.Id == timeEntryId && te.UserId == userId);

            if (timeEntry == null) return NotFound();
            if (timeEntry.EndTime != null) return BadRequest("Time tracking is already stopped");

            timeEntry.EndTime = DateTime.UtcNow;
            timeEntry.DurationMinutes = (int)(timeEntry.EndTime.Value - timeEntry.StartTime).TotalMinutes;

            await _context.SaveChangesAsync();

            return Ok(timeEntry);
        }

        private async Task<bool> CheckCircularDependency(int taskId, int dependsOnTaskId)
        {
            // Simple circular dependency check - in a real scenario, you'd want a more sophisticated algorithm
            var visited = new HashSet<int>();
            var queue = new Queue<int>();
            queue.Enqueue(dependsOnTaskId);

            while (queue.Count > 0)
            {
                var currentTaskId = queue.Dequeue();
                if (visited.Contains(currentTaskId)) continue;
                visited.Add(currentTaskId);

                if (currentTaskId == taskId) return true;

                var dependencies = await _context.TaskDependencies
                    .Where(td => td.TaskId == currentTaskId)
                    .Select(td => td.DependsOnTaskId)
                    .ToListAsync();

                foreach (var depId in dependencies)
                {
                    queue.Enqueue(depId);
                }
            }

            return false;
        }
    }
}
