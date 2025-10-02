# research.md

## Decisions

- Dashboard cadence: Produce both daily and weekly snapshots; daily for recency, weekly for trends.
- Authentication: Passwordless magic links via email; short-lived tokens (15m) and refresh via re-request.
- Data retention: Ingested content and logs retained for 90 days; user deletion requests processed within 24 hours.
- Privacy: Public outputs only include aggregated leaderboards with minimum distinct-user threshold to avoid attribution.
- Scoring: Algorithmic scoring with versioned scoring function and short signal explanations in metadata.
- Item limits: Max 50 items per daily snapshot and 200 items per weekly snapshot.
- Page-load target: Initial SSR render should target < 300ms p95 for cached snapshots.
- Fabric usage: No Fabric ingestion for Phase 1; enable Fabric ingestion as opt-in in later phases.
- Concurrency rules: Use last-writer-wins for snapshot writes and optimistic locking for edits.

## Rationale

- Daily+weekly covers both recency and trend analysis without heavy compute.
- Magic links reduce friction and align with modern auth for lightweight apps.
- 90-day retention balances analytics usefulness with privacy and storage costs.
- Aggregation prevents exposing PII in public datasets.
  /com

## Alternatives Considered

- OAuth vs magic links: Chosen magic links for faster implementation and lower friction.
- 30 vs 90-day retention: Chosen 90 days for richer trends; can be reduced later.

## Applied Defaults

- Item limits: max 50 items per daily snapshot, 200 per weekly snapshot.
- Page-load target: initial SSR render < 300ms p95 for cached snapshots.
- Fabric usage: No Fabric ingestion for Phase 1 (opt-in later).
- Concurrency rules: Last-writer-wins for snapshot writes; optimistic locking for edits.
