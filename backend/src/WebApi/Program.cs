using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Phantomhive.Application;
using Phantomhive.Application.Common.Interfaces;
using Phantomhive.Domain.Entities;
using Phantomhive.Infrastructure;
using Phantomhive.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Register Layer Services
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// Add Controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:1214")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Automatically create and seed DB
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // Automatically create sqlite file and tables
        context.Database.EnsureCreated();

        // Seed mock user R!Ciel if it doesn't exist
        var passwordHasher = services.GetRequiredService<IPasswordHasher>();
        var hasMockUser = await context.Users.AnyAsync(u => u.Username == "R!Ciel");
        if (!hasMockUser)
        {
            var mockUser = new User
            {
                Username = "R!Ciel",
                Email = "ciel@phantomhive.com",
                PasswordHash = passwordHasher.HashPassword("R!Ciel")
            };
            await context.Users.AddAsync(mockUser);
            await context.SaveChangesAsync();
            Console.WriteLine("Mock user 'R!Ciel' seeded successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during database migration/seeding: {ex.Message}");
    }
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
