using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp.Dtos
{
    public class StartTimeTrackingDto
    {
        [Required]
        public int TaskId { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class StopTimeTrackingDto
    {
        [Required]
        public int TimeEntryId { get; set; }
    }

    public class TimeEntryResponseDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string TaskTitle { get; set; } = "";
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? DurationMinutes { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TaskTimeSummaryDto
    {
        public int TaskId { get; set; }
        public string TaskTitle { get; set; } = "";
        public int? EstimatedMinutes { get; set; }
        public int TotalTimeSpentMinutes { get; set; }
        public int TimeEntryCount { get; set; }
        public DateTime? LastTimeEntry { get; set; }
    }
}
