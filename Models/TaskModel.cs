using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp.Models{

    public enum RecurrenceType
    {
        None,
        Daily,
        Weekly,
        Monthly,
        Custom
    }

    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Urgent = 4
    }

    public enum TaskCategory
    {
        Personal = 1,
        Work = 2,
        Health = 3,
        Education = 4,
        Finance = 5,
        Shopping = 6,
        Travel = 7,
        Other = 8
    }

    public class TaskModel{
        public int Id { get; set; }

        [Required]
        public required string UserId { get; set; } = "";

        [Required(ErrorMessage = "Title is required")]
        public required string Title { get; set; } = "";

        [Required(ErrorMessage = "Date is required")]
        public DateTime Date { get; set; }

        public bool IsCompleted { get; set; }

        public ApplicationUser? User { get; set; }

        public RecurrenceType RecurrenceType { get; set; }
        public int? RecurrenceInterval { get; set; }
        public int? RecurrenceCount { get; set; }
        public int? RecurrenceIndex { get; set; }

        // Nuevas propiedades para categorías y prioridades
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public TaskCategory Category { get; set; } = TaskCategory.Other;
        public string? Description { get; set; }
        public string? Tags { get; set; } // JSON string para múltiples etiquetas
        public bool IsArchived { get; set; } = false;
    }
}