using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using TaskManagerApp.Api;
using TaskManagerApp.Dtos;
using TaskManagerApp.Models;
using Xunit;

namespace TaskManagerApp.Tests.Controllers;

public class TasksApiControllerTests
{
    private readonly Mock<ILogger<TasksApiController>> _mockLogger;
    private readonly TasksApiController _controller;

    public TasksApiControllerTests()
    {
        _mockLogger = new Mock<ILogger<TasksApiController>>();
        _controller = new TasksApiController(_mockLogger.Object);
    }

    [Fact]
    public void GetTasks_ShouldReturnOkResult()
    {
        // Act
        var result = _controller.GetTasks();

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void GetTask_WithValidId_ShouldReturnOkResult()
    {
        // Arrange
        var taskId = 1;

        // Act
        var result = _controller.GetTask(taskId);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void GetTask_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var taskId = -1;

        // Act
        var result = _controller.GetTask(taskId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void CreateTask_WithValidData_ShouldReturnCreatedResult()
    {
        // Arrange
        var createTaskDto = new CreateTaskDto
        {
            Title = "Test Task",
            Description = "Test Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 2,
            Category = "Work"
        };

        // Act
        var result = _controller.CreateTask(createTaskDto);

        // Assert
        Assert.IsType<CreatedAtActionResult>(result.Result);
    }

    [Fact]
    public void CreateTask_WithInvalidData_ShouldReturnBadRequest()
    {
        // Arrange
        var createTaskDto = new CreateTaskDto
        {
            Title = "", // Invalid: empty title
            Description = "Test Description"
        };

        // Act
        var result = _controller.CreateTask(createTaskDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void UpdateTask_WithValidData_ShouldReturnOkResult()
    {
        // Arrange
        var taskId = 1;
        var updateTaskDto = new UpdateTaskDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            IsCompleted = true
        };

        // Act
        var result = _controller.UpdateTask(taskId, updateTaskDto);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void UpdateTask_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var taskId = -1;
        var updateTaskDto = new UpdateTaskDto
        {
            Title = "Updated Task"
        };

        // Act
        var result = _controller.UpdateTask(taskId, updateTaskDto);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void DeleteTask_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        var taskId = 1;

        // Act
        var result = _controller.DeleteTask(taskId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public void DeleteTask_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var taskId = -1;

        // Act
        var result = _controller.DeleteTask(taskId);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }
}
