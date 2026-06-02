using Microsoft.Extensions.DependencyInjection;
using Phantomhive.Application.Auth.Services;

namespace Phantomhive.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }
    }
}
