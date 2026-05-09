# Graph Report - phantomhive  (2026-05-06)

## Corpus Check
- 32 files · ~54,059 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 104 nodes · 74 edges · 32 communities (8 shown, 24 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a0903d85`
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
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `SingleSignOnService` - 6 edges
2. `LanguageSwitcherComponent` - 6 edges
3. `AuthService` - 5 edges
4. `FacebookSsoService` - 5 edges
5. `GithubSsoService` - 5 edges
6. `GoogleSsoService` - 5 edges
7. `TwitterSsoService` - 5 edges
8. `AppTranslationService` - 5 edges
9. `LoginComponent` - 3 edges
10. `HomeComponent` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (32 total, 24 thin omitted)

## Knowledge Gaps
- **6 isolated node(s):** `AppComponent`, `SingleSignOnModule`, `AppLayoutComponent`, `LayoutModule`, `FooterComponent` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AppComponent`, `SingleSignOnModule`, `AppLayoutComponent` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._