# Feature Specification: Personalized Content Dashboard (links / RSS / topics)

**Feature Branch**: `001-a-website-accessible`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "A website (accessible from mobile as well) where a user can log in and manage content they are interested in and/or enjoy. Each user should be able to easily add a link or rss feed or just a subject (kc royals, ai agents, etc) and the system will store all of these items per user. the System will provide a dashboard with a summary of the items/news the user is interested in for that day (or week? need to figure out time frame) and it will show metrics on the quality of the content, the value, etc of the context. It would be nice if it would also include some ratings or information on how biased the article is or at minimum some notes on things are not based in fact, etc. This portion could leverage fabric (specifically the use of patterns - https://github.com/danielmiessler/Fabric/tree/main/data/patterns ) .. main fabric repo here: https://github.com/danielmiessler/Fabric

the UI should be modern, clean and very performant / responsive. I thinking it would be best to have an api in the backend. Postgres for the database? Thinking bun and typescript for development. or dotnet. Homepage could show users all time highest rated content."

## Clarifications

### Session 2025-10-01

- Q: What dashboard timeframe should the system generate for users? → A: Both — system produces daily + weekly (both shown).
- Q: How should bias/factuality signals be produced? → A: Algorithmic scoring only.
- Q: Which authentication methods should we support initially? → A: Passwordless (magic links).
- Q: What is the desired data retention period for ingested content and related logs? → A: 90 days.
- Q: Should a user's subscriptions and dashboards be private by default, or should top-rated items be public by default? → A: Public aggregated leaderboard only (no user attribution).

## Execution Flow (main)

```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure) — technology preferences from the user are recorded under Ambiguities/Notes
- 👥 Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something, mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

As a registered user I want to add links, RSS feeds, or topic keywords to my personal list so that I receive both daily and weekly dashboards summarizing the most relevant content, with indicators about content quality, value, and potential bias or factual issues.

### Acceptance Scenarios

1. Given a registered user with no subscriptions, When they add a public article link, Then the system stores the link under their account and the next dashboard includes that content (or a pointer) if it's relevant.
2. Given a user adds an RSS feed URL, When the system fetches and parses the feed, Then new feed items are ingested and associated with the user and visible on their dashboard summary.
3. Given a user adds a topic keyword, When the content ingestion subsystem identifies matching items, Then those items are surfaced in the user's dashboard with source attribution and score metrics.
4. Given the dashboard generation run completes for the timeframe, When the user views the dashboard, Then they see per-item metrics (quality, value, bias/factuality notes) and an overall summary for the period.

### Edge Cases

- Duplicate sources: If a user adds the same link/feed/topic twice, the system should dedupe and inform the user.
- Invalid feed/URL: If an RSS URL or link is unreachable or unparsable, the system should mark the source as "invalid" and surface a helpful error to the user.
- Private or paywalled content: Content that requires auth or is paywalled should be surfaced as metadata (title, snippet) when possible and flagged as restricted.
- Rate limits and fetch failures: Feed fetching should handle transient failures and backoff; users should see last successful fetch time.
- Large volume: Users who subscribe to many sources should still receive a bounded dashboard (see [NEEDS CLARIFICATION] below on item limits).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to register and authenticate using passwordless magic links (create account by email, receive one-time login link).
- **FR-002**: System MUST allow users to add a "Source" of type: `link`, `rss_feed`, or `topic_keyword` and associate it with their account.
- **FR-003**: System MUST persist user sources and metadata per user and allow editing/removal.
- **FR-004**: System MUST periodically fetch and ingest content from user `rss_feed` sources and index newly discovered items for each user.
- **FR-005**: System MUST extract and store basic metadata for each Content Item: title, URL, published date, source, snippet, and content hash.
- **FR-006**: System MUST generate a Dashboard summary for each user for a defined timeframe (daily and weekly) that includes: top items, per-item metrics (quality score, value indicator, bias/factuality notes), and aggregate summaries.
- **FR-007**: System MUST allow users to mark items as "saved", "dismissed", or add a short annotation.
- **FR-008**: System MUST provide a public aggregated leaderboard of top-rated items across all users with no per-user attribution; leaderboard entries include item, aggregated score, and basic metadata only (no links to user profiles).
- **FR-009**: System MUST surface issues with an item (e.g., "likely biased", "contains unverified claims") and allow users to see the reasoning or underlying signals.
- **FR-010**: System MUST provide basic export of a user's subscriptions (CSV) and allow deleting all user data on request.
- **FR-011**: System MUST generate both daily and weekly dashboard snapshots; both are produced and available to view (daily for recent updates; weekly for summary).
- **FR-012**: Bias/factuality methodology: Algorithmic scoring performed by the system; scores must be versioned and include concise signal explanations for transparency.
- **FR-013**: Data retention: System MUST retain ingested content and related logs for 90 days by default; users may request earlier deletion and such requests must be honored within 24 hours.

_Marked ambiguities in functional scope:_

- **FR-014**: Item limits per dashboard and exact bounding rules: [NEEDS CLARIFICATION: max items per day/weekly snapshot and prioritization rules]

### Non-functional Requirements

- **NFR-001**: UI MUST be responsive and usable on mobile and desktop with a modern, minimal design.
- **NFR-002**: Dashboard load time must be performant: initial page render under [NEEDS CLARIFICATION: target ms].
- **NFR-003**: System MUST scale to handle background ingestion for many feeds without blocking user requests.
- **NFR-004**: Privacy & security: user data must be stored per-account and deletable on request; secrets (if any) must be stored securely.
- **NFR-005**: Accessibility: core screens should meet basic a11y standards (contrast, keyboard navigation, screen reader labels).
- **NFR-006**: Bias/factuality transparency: Each bias/factuality score MUST include a short `signal_explanations` array (max 3 items) and an `algorithm_version` string to support reproducibility and user-facing transparency.
- **NFR-007**: Data retention: ingested content and logs retained 90 days by default; retention policy documented and machine-enforceable.
- **NFR-008**: Public leaderboard privacy: leaderboard entries MUST NOT include user attribution; aggregation must enforce a minimum distinct-user threshold (suggested default: 3 users) to avoid exposing individual behavior.

### Key Entities _(include if feature involves data)_

- **User**: Represents a registered person. Key attributes: `id`, `email` (or external id), `display_name`, `preferences`, `auth_method` (e.g., "passwordless"), `last_login`, `created_at`.
- **Source**: Represents a user subscription. Key attributes: `id`, `user_id`, `type` (`link|rss_feed|topic_keyword`), `value` (URL or keyword), `metadata` (title, last_fetch, status), `created_at`.
- **ContentItem**: Represents an article or item discovered. Key attributes: `id`, `source_id` (nullable for topic-sourced items), `title`, `url`, `published_at`, `snippet`, `content_hash`, `ingested_at`.
- **UserSubscription**: Mapping between `User` and `Source` (may be implicit in Source schema depending on modeling).
- **Metric**: Per-item computed signals: `quality_score`, `value_score`, `bias_score`, `factuality_flags` (array of short notes), `signal_explanations` (short array, max 3), `algorithm_version`, `computed_at`.
- **DashboardSnapshot**: A precomputed summary for a user for a timeframe. Key attributes: `user_id`, `timeframe_start`, `timeframe_end`, `top_items` (ordered list), `aggregate_scores`.
- **FetchJob**: Background job record for scheduled feed fetch or content enrichment. Key attributes: `id`, `source_id`, `status`, `last_run`, `error_if_any`.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs) unless explicitly required and justified — technology preferences captured separately below
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed
- **Constitution Alignment**:
  - [ ] The plan for implementation (in draft) uses Bun tooling and TypeScript where applicable [NOTE: user expressed a preference; decision required]
  - [ ] TDD requirement documented: list of failing tests to be written prior to implementation
  - [ ] Any public contract changes will include updated contract tests in Phase 1 outputs

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Ambiguities, Assumptions & Notes

- Tech preferences: user suggested `Bun + TypeScript` or `dotnet`, and `Postgres` for DB. The spec avoids mandating these; implementers should confirm.

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---

Next steps / Recommendations

- Clarify remaining ambiguity: item limits per dashboard and prioritization rules.
- Product owner to confirm technology preference (Bun+TypeScript vs dotnet) and acceptance of Fabric patterns for bias signals.
- Define measurable NFR targets (page load ms, item limits per dashboard).
- Write failing tests for core flows (user registration + add source + ingest small feed + dashboard generation) before implementation (TDD first).
