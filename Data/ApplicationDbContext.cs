using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using TaskManagerApp.Models;

namespace TaskManagerApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TaskModel> Tasks { get; set; }
        public DbSet<ProjectModel> Projects { get; set; }
        public DbSet<TaskDependencyModel> TaskDependencies { get; set; }
        public DbSet<TimeEntryModel> TimeEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Task relationships
            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.SetNull);

            // Subtasks self-referencing relationship
            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.ParentTask)
                .WithMany(t => t.Subtasks)
                .HasForeignKey(t => t.ParentTaskId)
                .OnDelete(DeleteBehavior.Restrict);

            // Project relationships
            modelBuilder.Entity<ProjectModel>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Task Dependencies
            modelBuilder.Entity<TaskDependencyModel>()
                .HasKey(td => td.Id);

            modelBuilder.Entity<TaskDependencyModel>()
                .HasOne(td => td.Task)
                .WithMany(t => t.Dependencies)
                .HasForeignKey(td => td.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskDependencyModel>()
                .HasOne(td => td.DependsOnTask)
                .WithMany(t => t.DependsOn)
                .HasForeignKey(td => td.DependsOnTaskId)
                .OnDelete(DeleteBehavior.Restrict);

            // Time Entries
            modelBuilder.Entity<TimeEntryModel>()
                .HasOne(te => te.Task)
                .WithMany(t => t.TimeEntries)
                .HasForeignKey(te => te.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TimeEntryModel>()
                .HasOne(te => te.User)
                .WithMany()
                .HasForeignKey(te => te.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for performance
            modelBuilder.Entity<TaskModel>()
                .HasIndex(t => new { t.UserId, t.IsCompleted, t.Date })
                .HasDatabaseName("IX_Tasks_UserId_IsCompleted_Date");

            modelBuilder.Entity<TaskModel>()
                .HasIndex(t => t.ParentTaskId);

            modelBuilder.Entity<TaskModel>()
                .HasIndex(t => t.ProjectId);

            modelBuilder.Entity<ProjectModel>()
                .HasIndex(p => p.UserId);

            modelBuilder.Entity<TimeEntryModel>()
                .HasIndex(te => new { te.TaskId, te.UserId });
        }
    }
}