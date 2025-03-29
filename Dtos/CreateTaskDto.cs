using System.ComponentModel.DataAnnotations;
using TaskManagerApp.Validators;

namespace TaskManagerApp.ViewModels
{
    public class CreateTaskDto
    {
        [Required]
        [MinLength(1)]
        public string Title { get; set; } = null!;

        [FutureDate(ErrorMessage = "Date must be in the future")]
        public DateTime Date { get; set; }

        public string? RecurrenceType { get; set; }
        public int? RecurrenceInterval { get; set; }
        public int? RecurrenceCount { get; set; }
    }
}
