# data-model.md

## Entities

### User

- id: uuid
- email: string
- createdAt: timestamp
- lastActiveAt: timestamp
- preferences: json

### Source

- id: uuid
- user_id: uuid
- type: enum [link, rss_feed, topic_keyword]
- value: string (URL or keyword)
- metadata: json (title, last_fetch, status, error)
- created_at: timestamp
- last_fetch_at: timestamp

### UserSubscription

- id: uuid
- user_id: uuid
- source_id: uuid
- created_at: timestamp
- Note: In some schemas `Source` may include `user_id` directly; choose either an explicit mapping table (`UserSubscription`) or embed `user_id` on `Source`. The plan currently uses `Source.user_id` (simpler).

### ContentItem

- id: uuid
- title: string
- url: string
- source_id: uuid (nullable for topic-sourced items)
- published_at: timestamp
- ingested_at: timestamp
- snippet: string
- content_hash: string
- metadata: json

### Metric

- id: uuid
- content_item_id: uuid
- quality_score: number
- value_score: number
- bias_score: number
- factuality_flags: array<string>
- signal_explanations: array<string> (max 3)
- algorithm_version: string
- computed_at: timestamp

### DashboardSnapshot

- id: uuid
- user_id: uuid
- period: enum [daily, weekly]
- start_at: timestamp
- end_at: timestamp
- items: array of SnapshotItem
- created_at: timestamp
- algorithm_version: string
- version: number (optimistic locking)

### SnapshotItem

- content_item_id: uuid
- score: number
- signals: json (short explanations)

### FetchJob

- id: uuid
- source_id: uuid
- status: enum [pending, running, succeeded, failed]
- last_run: timestamp
- attempts: integer
- error: string (nullable)
- scheduled_at: timestamp (when next run is scheduled)

## Per-period Defaults

- Daily snapshot item limit: max 50 items.

Maximum items per daily snapshot: 50 items. Maximum items per weekly snapshot: 200 items. Items are sorted by `score` in descending order. Items are deduplicated by `url` (normalized); when multiple items share the same `url`, keep the most recently ingested item (`ingested_at`). For items with equal `score` and different `url`s, break ties by `published_at` newest first.

- Weekly snapshot item limit: max 200 items.

## Retention & Indexing

- Retain raw content and logs for 90 days.
- Index daily snapshots by `user_id` and `start_at` for fast queries.
- Index ContentItem by `content_hash` and `published_at` for dedup and range queries.

## Notes

- Scoring fields are versioned: `algorithm_version` is stored on both `Metric` and `DashboardSnapshot` to ensure reproducible snapshots.
- Aggregation thresholds: only show public leaderboard if >= 5 distinct users contributed (spec suggests 3, plan suggests 5 — reconcile with product owner; plan currently uses 5).
- Page-load performance target: initial SSR render of cached snapshots should be < 300ms p95.

Dashboard SSR initial render target: initial page render under 300ms p95 for cached snapshots.

- Fabric ingestion: Disabled for Phase 1 (opt-in in later phases).
- Concurrency: Snapshot writes follow last-writer-wins; snapshot edits use optimistic locking with a `version` field.

## Defaults

- Per-period item limits: daily <= 50 items, weekly <= 200 items.
- Performance target: provide cached snapshots so SSR initial render < 300ms p95.
- Fabric ingestion: disabled in Phase 1; plan for opt-in in Phase 2.
- Concurrency: snapshot writes use last-writer-wins; edits use optimistic locking with a `version` field.
