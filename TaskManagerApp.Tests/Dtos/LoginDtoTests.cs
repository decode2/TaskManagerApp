using System.ComponentModel.DataAnnotations;
using TaskManagerApp.Dtos;
using Xunit;

namespace TaskManagerApp.Tests.Dtos;

public class LoginDtoTests
{
    [Fact]
    public void LoginDto_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.Empty(validationResults);
    }

    [Fact]
    public void LoginDto_WithInvalidEmail_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "invalid-email", // Invalid email format
            Password = "Password123!"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Email"));
    }

    [Fact]
    public void LoginDto_WithEmptyEmail_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "", // Invalid: empty email
            Password = "Password123!"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Email"));
    }

    [Fact]
    public void LoginDto_WithNullEmail_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = null, // Invalid: null email
            Password = "Password123!"
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Email"));
    }

    [Fact]
    public void LoginDto_WithEmptyPassword_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "test@example.com",
            Password = "" // Invalid: empty password
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Password"));
    }

    [Fact]
    public void LoginDto_WithNullPassword_ShouldFailValidation()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "test@example.com",
            Password = null // Invalid: null password
        };

        // Act
        var validationResults = ValidateModel(dto);

        // Assert
        Assert.NotEmpty(validationResults);
        Assert.Contains(validationResults, v => v.MemberNames.Contains("Password"));
    }

    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var ctx = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, ctx, validationResults, true);
        return validationResults;
    }
}
