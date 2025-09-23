using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerApp.Api;
using TaskManagerApp.Data;
using TaskManagerApp.Dtos;
using TaskManagerApp.Models;
using Xunit;

namespace TaskManagerApp.IntegrationTests;

public class TasksApiUnitTests
{
    private static ApplicationDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite("DataSource=:memory:")
            .Options;
        var db = new ApplicationDbContext(options);
        db.Database.OpenConnection();
        db.Database.EnsureCreated();
        return db;
    }

    private static TasksApiController CreateController(ApplicationDbContext db, string userId = "test-user")
    {
        var controller = new TasksApiController(db);
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
        return controller;
    }

    [Fact]
    public async Task GetTasks_EmptyDb_ReturnsEmptyList()
    {
        using var db = CreateDb();
        var controller = CreateController(db);

        var result = await controller.GetTasks();
        var okData = Assert.IsType<ActionResult<IEnumerable<TaskModel>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<TaskModel>>(okData.Value!);
        Assert.Empty(list);
    }

    [Fact]
    public async Task CreateTask_PastDate_ReturnsBadRequest()
    {
        using var db = CreateDb();
        var controller = CreateController(db);

        var dto = new CreateTaskDto
        {
            Title = "Past Task",
            Date = DateTime.UtcNow.AddDays(-1).ToString("o"),
            Priority = TaskPriority.Low,
            Category = TaskCategory.General,
            Description = "Test description",
            Tags = "test"
        };

        var result = await controller.CreateTask(dto);
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }
}
