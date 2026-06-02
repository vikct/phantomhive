using Phantomhive.Domain.Entities;

namespace Phantomhive.Application.Common.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
