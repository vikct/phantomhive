# Graph Report - phantomhive  (2026-06-03)

## Corpus Check
- 58 files · ~62,251 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 274 nodes · 229 edges · 41 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7f4d53e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 46|Community 46]]

## God Nodes (most connected - your core abstractions)
1. `GalleryComponent` - 27 edges
2. `GoogleDriveService` - 10 edges
3. `GoogleDriveController` - 9 edges
4. `AuthService` - 8 edges
5. `AuthService` - 8 edges
6. `GalleryService` - 7 edges
7. `SingleSignOnService` - 7 edges
8. `TwitterSsoService` - 7 edges
9. `GoogleSsoService` - 7 edges
10. `GithubSsoService` - 7 edges

## Surprising Connections (you probably didn't know these)
- `GoogleDriveController` --inherits--> `ControllerBase`  [EXTRACTED]
  backend/src/WebApi/Controllers/GoogleDriveController.cs → backend/src/WebApi/Controllers/AuthController.cs
- `AuthService` --inherits--> `IAuthService`  [EXTRACTED]
  backend/src/Application/Auth/Services/AuthService.cs → backend/src/WebApi/Controllers/AuthController.cs
- `AuthService` --references--> `IApplicationDbContext`  [EXTRACTED]
  backend/src/Application/Auth/Services/AuthService.cs → backend/src/Infrastructure/Persistence/ApplicationDbContext.cs

## Communities (61 total, 37 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (13): ControllerBase, AuthController, Phantomhive.WebApi.Controllers, DbContext, IApplicationDbContext, IAuthService, IFirebaseTokenVerifier, IPasswordHasher (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (7): CreateFolderRequest, DeleteBatchRequest, GoogleDriveController, MoveBatchRequest, Phantomhive.WebApi.Controllers, RenameRequest, IGoogleDriveService

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (4): DriveService, GoogleDriveService, Phantomhive.Infrastructure.Services, string

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (3): GoogleDriveItemDto, IGoogleDriveService, Phantomhive.Application.Common.Interfaces

## Knowledge Gaps
- **30 isolated node(s):** `Phantomhive.Application`, `Phantomhive.Application.GlobalUsings.g.cs`, `Phantomhive.Application.Auth.DTOs`, `SsoLoginRequest`, `Phantomhive.Application.Auth.DTOs` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GoogleDriveController` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `ControllerBase` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `Phantomhive.Application`, `Phantomhive.Application.GlobalUsings.g.cs`, `Phantomhive.Application.Auth.DTOs` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._