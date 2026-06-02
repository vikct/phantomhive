using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Phantomhive.Application.Auth.DTOs;
using Phantomhive.Application.Common.Interfaces;
using Phantomhive.Domain.Entities;

namespace Phantomhive.Application.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly IApplicationDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;
        private readonly IFirebaseTokenVerifier _firebaseTokenVerifier;

        public AuthService(
            IApplicationDbContext context,
            IPasswordHasher passwordHasher,
            ITokenService tokenService,
            IFirebaseTokenVerifier firebaseTokenVerifier)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
            _firebaseTokenVerifier = firebaseTokenVerifier;
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Username);

            if (user == null || user.PasswordHash == null)
            {
                return null;
            }

            var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return null;
            }

            var token = _tokenService.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            };
        }

        public async Task<AuthResponse?> SsoLoginAsync(SsoLoginRequest request)
        {
            var claims = await _firebaseTokenVerifier.VerifyTokenAsync(request.IdToken);
            if (claims == null)
            {
                return null;
            }

            // Find user by SSO identifier first
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.SsoProvider == request.Provider && u.SsoProviderId == claims.Uid);

            if (user == null)
            {
                // Fallback to email to link account
                user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == claims.Email);

                if (user != null)
                {
                    // Link SSO details to existing account
                    user.SsoProvider = request.Provider;
                    user.SsoProviderId = claims.Uid;
                    _context.Users.Update(user);
                }
                else
                {
                    // Register new user from SSO
                    user = new User
                    {
                        Username = string.IsNullOrEmpty(claims.Name) ? claims.Email.Split('@')[0] : claims.Name,
                        Email = claims.Email,
                        SsoProvider = request.Provider,
                        SsoProviderId = claims.Uid
                    };
                    await _context.Users.AddAsync(user);
                }

                await _context.SaveChangesAsync();
            }

            var token = _tokenService.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            };
        }
    }
}
