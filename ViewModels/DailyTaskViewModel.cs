using TaskManagerApp.Models;

namespace TaskManagerApp.ViewModels
{
    /// <summary>
    /// Represents tasks grouped by a specific day.
    /// </summary>
    public class DailyTaskViewModel
    {
        public DateTime Date { get; set; }
        public List<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }
}
