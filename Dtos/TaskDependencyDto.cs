using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp.Dtos
{
    public class CreateTaskDependencyDto
    {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public int DependsOnTaskId { get; set; }
    }

    public class TaskDependencyResponseDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string TaskTitle { get; set; } = "";
        public int DependsOnTaskId { get; set; }
        public string DependsOnTaskTitle { get; set; } = "";
        public bool IsBlocked { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TaskHierarchyDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public bool IsCompleted { get; set; }
        public int Level { get; set; }
        public List<TaskHierarchyDto> Subtasks { get; set; } = new List<TaskHierarchyDto>();
    }
}
