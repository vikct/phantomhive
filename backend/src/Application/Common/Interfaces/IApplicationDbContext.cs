using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Phantomhive.Domain.Entities;

namespace Phantomhive.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
