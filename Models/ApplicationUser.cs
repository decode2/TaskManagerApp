using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace TaskManagerApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}

