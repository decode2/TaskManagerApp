using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace TaskManagerApp.ViewModels{
    public class UpdateTaskDto{

        [Required]
        public int Id  { get; set; }
        
        [Required(ErrorMessage = "Title is required")]
        [MinLength(1, ErrorMessage = "Title cannot be empty")]
        public required string Title { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [BindRequired]
        public bool IsCompleted { get; set; }
    }
}