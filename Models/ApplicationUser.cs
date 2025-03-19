using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

public class ApplicationUser : IdentityUser{

    public ICollection<TaskManagerApp.Models.TaskModel> Tasks { get; set; } = new List<TaskManagerApp.Models.TaskModel>();
}