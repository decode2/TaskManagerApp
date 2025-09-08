using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManagerApp.Data;
using TaskManagerApp.Models;
using TaskManagerApp.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add essential services
builder.Services.AddControllers();

// MySQL + EF Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Identity
builder.Services.AddDefaultIdentity<ApplicationUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedAccount = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>();

// JWT Service
builder.Services.AddScoped<JwtService>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is missing in configuration");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// CORS for React frontend - using environment variables
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOrigins = builder.Configuration["Security:CorsAllowedOrigins"]?.Split(',') ?? new[]
        {
            "https://localhost:3000",
            "https://192.168.0.21",
            "https://taskmanager.local",
            "https://myapp.local",
            "https://tasks.local"
        };

        policy.SetIsOriginAllowed(origin =>
        {
            return allowedOrigins.Any(allowedOrigin => 
                origin.StartsWith(allowedOrigin.Trim())) ||
                origin.StartsWith("http://localhost:") ||
                origin.StartsWith("https://localhost:") ||
                origin.StartsWith("http://127.0.0.1:") ||
                origin.StartsWith("https://127.0.0.1:") ||
                origin.StartsWith("http://192.168.") ||
                origin.StartsWith("https://192.168.") ||
                origin.StartsWith("http://10.") ||
                origin.StartsWith("https://10.") ||
                origin.StartsWith("http://172.") ||
                origin.StartsWith("https://172.");
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

// HTTPS redirection based on environment and available ports
var enableHttpsRedirect = builder.Configuration.GetValue<bool>("Security:EnableHttpsRedirect", true);
if (enableHttpsRedirect && app.Environment.IsDevelopment())
{
    // Only enable HTTPS redirection if we're running with both HTTP and HTTPS ports
    var httpsPort = builder.Configuration.GetValue<int>("App:Port", 7044);
    if (httpsPort > 0)
    {
        app.UseHttpsRedirection();
    }
}
else if (enableHttpsRedirect && !app.Environment.IsDevelopment())
{
    // In production, always use HTTPS redirection
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// Serve static files from React build
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = ""
});

// Map API controllers first
app.MapControllers();

// Serve React app for all non-API routes (fallback)
app.MapFallbackToFile("index.html");

app.Run();
