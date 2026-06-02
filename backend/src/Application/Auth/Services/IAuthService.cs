using System.Threading.Tasks;
using Phantomhive.Application.Auth.DTOs;

namespace Phantomhive.Application.Auth.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<AuthResponse?> SsoLoginAsync(SsoLoginRequest request);
    }
}
