namespace TaskManagerApp.Models{
    public class TaskModel{
        public int Id { get; set; }
        public required string UserId { get; set; }
        public required string Title { get; set; }
        public DateTime Date { get; set; }
        public bool IsCompleted { get; set; }

        public required ApplicationUser User { get; set; }
    }
}