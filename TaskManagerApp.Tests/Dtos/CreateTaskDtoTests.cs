using System.ComponentModel.DataAnnotations;
using TaskManagerApp.Dtos;
using Xunit;

namespace TaskManagerApp.Tests.Dtos;

public class CreateTaskDtoTests
{
    [Fact]
    public void CreateTaskDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 2,
            Category = "Work"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.Empty(validationResults);
    }

    [Fact]
    public void CreateTaskDto_WithEmptyTitle_ShouldFailValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "", // Invalid: empty title
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 2,
            Category = "Work"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Title"));
    }

    [Fact]
    public void CreateTaskDto_WithNullTitle_ShouldFailValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = null, // Invalid: null title
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 2,
            Category = "Work"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Title"));
    }

    [Fact]
    public void CreateTaskDto_WithPastDueDate_ShouldFailValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(-1), // Invalid: past date
            Priority = 2,
            Category = "Work"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("DueDate"));
    }

    [Fact]
    public void CreateTaskDto_WithInvalidPriority_ShouldFailValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 5, // Invalid: priority out of range (1-4)
            Category = "Work"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Priority"));
    }

    [Fact]
    public void CreateTaskDto_WithEmptyCategory_ShouldFailValidation()
    {
        // Arrange
        var dto = new CreateTaskDto
        {
            Title = "Valid Task",
            Description = "Valid Description",
            DueDate = DateTime.Now.AddDays(1),
            Priority = 2,
            Category = "" // Invalid: empty category
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Category"));
    }

    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var ctx = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, ctx, validationResults, true);
        return validationResults;
    }
}
