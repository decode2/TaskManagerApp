using System.ComponentModel.DataAnnotations;
using TaskManagerApp.Models;

namespace TaskManagerApp.Dtos
{
    public class CreateProjectDto
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; } = "";

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(7)]
        public string Color { get; set; } = "#3B82F6";
    }

    public class UpdateProjectDto
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; } = "";

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(7)]
        public string Color { get; set; } = "#3B82F6";

        public bool IsArchived { get; set; } = false;
    }

    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string Color { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsArchived { get; set; }
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
    }
}
