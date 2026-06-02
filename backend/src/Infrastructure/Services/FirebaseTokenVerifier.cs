using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Phantomhive.Application.Common.Interfaces;

namespace Phantomhive.Infrastructure.Services
{
    public class FirebaseTokenVerifier : IFirebaseTokenVerifier
    {
        private readonly HttpClient _httpClient;

        public FirebaseTokenVerifier(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<FirebaseUserClaims?> VerifyTokenAsync(string idToken)
        {
            try
            {
                var projectId = "fenrisulfr42";
                var keysUrl = $"https://www.googleapis.com/robot/v1/metadata/x509/securetoken-api-project-{projectId}";

                // Fetch Google public certificates for verification
                var certificates = await _httpClient.GetFromJsonAsync<Dictionary<string, string>>(keysUrl);
                if (certificates == null) return null;

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = $"https://securetoken.google.com/{projectId}",
                    ValidateAudience = true,
                    ValidAudience = projectId,
                    ValidateLifetime = true,
                    IssuerSigningKeyResolver = (token, securityToken, kid, validationParams) =>
                    {
                        var keys = new List<SecurityKey>();
                        if (certificates.TryGetValue(kid, out var certPem))
                        {
                            var certBytes = Convert.FromBase64String(certPem
                                .Replace("-----BEGIN CERTIFICATE-----", "")
                                .Replace("-----END CERTIFICATE-----", "")
                                .Replace("\n", "")
                                .Replace("\r", "")
                                .Trim());
                            var certificate = System.Security.Cryptography.X509Certificates.X509CertificateLoader.LoadCertificate(certBytes);
                            keys.Add(new X509SecurityKey(certificate));
                        }
                        return keys;
                    }
                };

                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(idToken, validationParameters, out var validatedToken);
                if (principal == null) return null;

                var jwtToken = (JwtSecurityToken)validatedToken;
                var email = jwtToken.Payload.GetValueOrDefault("email")?.ToString() ?? string.Empty;
                var name = jwtToken.Payload.GetValueOrDefault("name")?.ToString() ?? string.Empty;
                var uid = jwtToken.Subject;

                return new FirebaseUserClaims(email, name, uid);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Firebase verification failed: {ex.Message}");
                return null;
            }
        }
    }
}
