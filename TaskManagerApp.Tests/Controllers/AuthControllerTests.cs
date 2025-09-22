using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using TaskManagerApp.Api;
using TaskManagerApp.Dtos;
using Xunit;

namespace TaskManagerApp.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<ILogger<AuthController>> _mockLogger;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockLogger = new Mock<ILogger<AuthController>>();
        _controller = new AuthController(_mockLogger.Object);
    }

    [Fact]
    public void Register_WithValidData_ShouldReturnOkResult()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var result = _controller.Register(registerDto);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void Register_WithInvalidEmail_ShouldReturnBadRequest()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "invalid-email", // Invalid email format
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Act
        var result = _controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void Register_WithMismatchedPasswords_ShouldReturnBadRequest()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "Password123!",
            ConfirmPassword = "DifferentPassword123!" // Mismatched passwords
        };

        // Act
        var result = _controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void Register_WithWeakPassword_ShouldReturnBadRequest()
    {
        // Arrange
        var registerDto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "123", // Weak password
            ConfirmPassword = "123"
        };

        // Act
        var result = _controller.Register(registerDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void Login_WithValidCredentials_ShouldReturnOkResult()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var result = _controller.Login(loginDto);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void Login_WithInvalidEmail_ShouldReturnBadRequest()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "invalid-email", // Invalid email format
            Password = "Password123!"
        };

        // Act
        var result = _controller.Login(loginDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void Login_WithEmptyPassword_ShouldReturnBadRequest()
    {
        // Arrange
        var loginDto = new LoginDto
        {
            Email = "test@example.com",
            Password = "" // Empty password
        };

        // Act
        var result = _controller.Login(loginDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void RefreshToken_WithValidToken_ShouldReturnOkResult()
    {
        // Arrange
        var refreshTokenDto = new AuthDto
        {
            RefreshToken = "valid-refresh-token"
        };

        // Act
        var result = _controller.RefreshToken(refreshTokenDto);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void RefreshToken_WithInvalidToken_ShouldReturnBadRequest()
    {
        // Arrange
        var refreshTokenDto = new AuthDto
        {
            RefreshToken = "" // Empty token
        };

        // Act
        var result = _controller.RefreshToken(refreshTokenDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public void Logout_ShouldReturnOkResult()
    {
        // Arrange
        var logoutDto = new AuthDto
        {
            RefreshToken = "valid-refresh-token"
        };

        // Act
        var result = _controller.Logout(logoutDto);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
    }
}
