using System.Threading.Tasks;

namespace Phantomhive.Application.Common.Interfaces
{
    public record FirebaseUserClaims(string Email, string Name, string Uid);

    public interface IFirebaseTokenVerifier
    {
        Task<FirebaseUserClaims?> VerifyTokenAsync(string idToken);
    }
}
