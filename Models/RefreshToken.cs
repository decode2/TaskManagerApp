using System;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        public string Token { get; set; } = string.Empty;

        public DateTime Expires { get; set; }

        // Foreign Key
        public string UserId { get; set; } = string.Empty;

        public ApplicationUser User { get; set; } = null!;
    }
}
