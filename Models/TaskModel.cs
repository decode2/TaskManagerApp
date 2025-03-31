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
    }
}