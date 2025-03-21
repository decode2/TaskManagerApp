using TaskManagerApp.Models;

namespace TaskManagerApp.ViewModels
{
    public class DailyTaskViewModel
    {
        public DateTime Date { get; set; }
        public List<TaskModel> Tasks { get; set; } = new List<TaskModel>();
    }

    public class WeeklyTaskViewModel
    {
        public List<DailyTaskViewModel> WeeklyTasks { get; set; } = new List<DailyTaskViewModel>();
    }
}