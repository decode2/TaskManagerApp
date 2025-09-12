using System.ComponentModel.DataAnnotations;
using TaskManagerApp.Validators;
using TaskManagerApp.Models;

namespace TaskManagerApp.ViewModels
{
    public class CreateTaskDto
    {
        [Required]
        [MinLength(1)]
        public string Title { get; set; } = null!;

        [Required]
        public string Date { get; set; } = null!;

        public string? RecurrenceType { get; set; }
        public int? RecurrenceInterval { get; set; }
        public int? RecurrenceCount { get; set; }

        // Nuevas propiedades
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public TaskCategory Category { get; set; } = TaskCategory.Other;
        public string? Description { get; set; }
        public string? Tags { get; set; }

        // Computed property to get DateTime from string
        public DateTime DateAsDateTime => DateTime.Parse(Date);
    }
}
