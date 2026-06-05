using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Phantomhive.Application.Common.Interfaces;
using Phantomhive.Infrastructure.Identity;
using Phantomhive.Infrastructure.Persistence;
using Phantomhive.Infrastructure.Services;

namespace Phantomhive.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=phantomhive.db";

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                if (connectionString.Contains("Host=") || connectionString.Contains("Server=") || connectionString.Contains("Port="))
                {
                    options.UseNpgsql(connectionString);
                }
                else
                {
                    options.UseSqlite(connectionString);
                }
            });

            services.AddScoped<IApplicationDbContext>(provider =>
                provider.GetRequiredService<ApplicationDbContext>());

            services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
            services.AddScoped<ITokenService, JwtTokenGenerator>();

            // Register HttpClient for FirebaseTokenVerifier
            services.AddHttpClient<IFirebaseTokenVerifier, FirebaseTokenVerifier>();

            // Register GoogleDriveService
            services.AddScoped<IGoogleDriveService, GoogleDriveService>();

            return services;
        }
    }
}
