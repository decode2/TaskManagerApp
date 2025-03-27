using TaskManagerApp.ViewModels;

namespace TaskManagerApp.ViewModels
{
    /// <summary>
    /// Represents a week's worth of daily tasks.
    /// </summary>
    public class WeeklyTaskViewModel
    {
        public List<DailyTaskViewModel> WeeklyTasks { get; set; } = new List<DailyTaskViewModel>();
    }
}
