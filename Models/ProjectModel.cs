using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp.Models
{
    public class ProjectModel
    {
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; } = "";

        [Required]
        [MaxLength(200)]
        public required string Name { get; set; } = "";

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(7)]
        public string Color { get; set; } = "#3B82F6"; // Hex color for project

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsArchived { get; set; } = false;

        // Navigation properties
        public ApplicationUser? User { get; set; }
        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }

    public class TaskDependencyModel
    {
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        public int DependsOnTaskId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public TaskModel Task { get; set; } = null!;
        public TaskModel DependsOnTask { get; set; } = null!;
    }

    public class TimeEntryModel
    {
        public int Id { get; set; }

        [Required]
        public int TaskId { get; set; }

        [Required]
        public required string UserId { get; set; } = "";

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? DurationMinutes { get; set; } // Calculated duration

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public TaskModel Task { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
