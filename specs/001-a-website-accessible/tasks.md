# tasks.md (Phase 3 - Detailed Task List)

Path: /home/josh/projects/joshNews/specs/001-a-website-accessible/tasks.md

This file contains an ordered list of tasks for Phase 3 of the "Website Accessible" feature. Tasks follow TDD ordering: tests first, then implementation. Each task includes an id, title, short description, owner, priority, estimate (in story points), and related file paths.

Note: Owners: `developer-bun` indicates subagent responsible for Bun/TypeScript implementation; `general` indicates this subagent's responsibilities.

1. id: T001
   title: Add contract test for POST /api/v1/auth/magic-link
   description: Create a failing contract test asserting POST /api/v1/auth/magic-link returns 202 and appropriate response shape.
   owner: general
   priority: high
   estimate: 1
   files:

   - /home/josh/projects/joshNews/tests/contract/test_auth_magic_link.test.ts

2. id: T002
   title: Add contract test for GET /api/v1/auth/verify
   description: Create a failing contract test asserting GET /api/v1/auth/verify returns 200 with userId and sessionToken.
   owner: general
   priority: high
   estimate: 1
   files:

   - /home/josh/projects/joshNews/tests/contract/test_auth_verify.test.ts

3. id: T003
   title: Add contract tests for Sources CRUD
   description: Create failing contract tests for POST /api/v1/sources (201) and GET /api/v1/sources (200) verifying basic CRUD contract.
   owner: general
   priority: high
   estimate: 1
   files:

   - /home/josh/projects/joshNews/tests/contract/test_sources_crud.test.ts

4. id: T004
   title: Add contract test for dashboards period endpoint
   description: Create failing contract test for GET /api/v1/dashboards/daily asserting 200, max 50 items, sorted by score desc.
   owner: general
   priority: high
   estimate: 1
   files:

   - /home/josh/projects/joshNews/tests/contract/test_dashboards_period.test.ts

5. id: T005
   title: Add unit tests for data model validation rules
   description: Create failing unit tests validating URL fields, `signal_explanations` length cap, required fields, and type constraints for data models.
   owner: general
   priority: high
   estimate: 1
   files:

   - /home/josh/projects/joshNews/tests/unit/models/dataModel.validation.test.ts
   - /home/josh/projects/joshNews/src/models/\*

6. id: T006
   title: Implement auth magic-link endpoint (stub)
   description: Implement minimal POST /api/v1/auth/magic-link returning 202 to satisfy contract test. Keep logic minimal and well-typed.
   owner: developer-bun
   priority: high
   estimate: 2
   files:

   - /home/josh/projects/joshNews/src/routes/auth.ts
   - /home/josh/projects/joshNews/src/server.ts

7. id: T007
   title: Implement auth verify endpoint (stub)
   description: Implement minimal GET /api/v1/auth/verify returning 200 with userId and sessionToken placeholders.
   owner: developer-bun
   priority: high
   estimate: 2
   files:

   - /home/josh/projects/joshNews/src/routes/auth.ts
   - /home/josh/projects/joshNews/src/server.ts

8. id: T008
   title: Implement Sources POST + GET endpoints (stub)
   description: Implement minimal POST /api/v1/sources (returns 201) and GET /api/v1/sources (returns 200) with in-memory store for dev.
   owner: developer-bun
   priority: high
   estimate: 2
   files:

   - /home/josh/projects/joshNews/src/routes/sources.ts
   - /home/josh/projects/joshNews/src/services/sourceService.ts

9. id: T009
   title: Implement dashboard daily endpoint (stub)
   description: Implement GET /api/v1/dashboards/daily returning 200 and placeholder list; ensure sorting and cap behavior later in tests.
   owner: developer-bun
   priority: high
   estimate: 2
   files:

   - /home/josh/projects/joshNews/src/routes/dashboards.ts
   - /home/josh/projects/joshNews/src/services/dashboardService.ts

10. id: T010
    title: Implement data-model validation (types + runtime checks)
    description: Add TypeScript interfaces and runtime validation helpers for models (Source, ContentItem, User) enforcing URL, arrays, and caps.
    owner: developer-bun
    priority: high
    estimate: 2
    files:

    - /home/josh/projects/joshNews/src/models/dataModel.ts
    - /home/josh/projects/joshNews/src/lib/validators.ts

11. id: T011
    title: Add integration test for add-source -> ingest -> snapshot flow
    description: Create an end-to-end failing integration test that will be implemented after minimal endpoints exist.
    owner: general
    priority: med
    estimate: 2
    files:

    - /home/josh/projects/joshNews/tests/integration/test_end_to_end_snapshot.test.ts

12. id: T012
    title: Add background fetcher job scaffold
    description: Add FetchJob skeleton that will later poll sources and persist items; include retry/backoff plan.
    owner: developer-bun
    priority: med
    estimate: 2
    files:

    - /home/josh/projects/joshNews/src/jobs/fetchJob.ts

13. id: T013
    title: Add persistence adapters (memory + file)
    description: Implement in-memory adapter for tests and lightweight file adapter for local dev persistence.
    owner: developer-bun
    priority: med
    estimate: 2
    files:

    - /home/josh/projects/joshNews/src/adapters/memoryAdapter.ts
    - /home/josh/projects/joshNews/src/adapters/fileAdapter.ts

14. id: T014
    title: Add snapshot generator service
    description: Implement snapshot generation with dedupe, scoring, and limit caps for daily/weekly snapshots (stubbed logic first).
    owner: developer-bun
    priority: med
    estimate: 3
    files:

    - /home/josh/projects/joshNews/src/services/snapshotService.ts

15. id: T015
    title: Add tests for snapshot dedupe and ordering
    description: Unit and integration tests that assert snapshot dedupe, scoring, and ordering behavior.
    owner: general
    priority: med
    estimate: 2
    files:

    - /home/josh/projects/joshNews/tests/unit/services/snapshot.service.test.ts

16. id: T016
    title: Wire server startup helper for tests
    description: Ensure `/tests/setup/server.ts` integrates with app entrypoint and returns stop function for tests.
    owner: developer-bun
    priority: med
    estimate: 1
    files:

    - /home/josh/projects/joshNews/tests/setup/server.ts
    - /home/josh/projects/joshNews/src/main.ts

17. id: T017
    title: Add CI workflow for Bun commands
    description: Add GitHub Actions workflow that runs `bun install`, `bun run lint -- --fix`, `bun run format --check`, and `bun test`.
    owner: developer-bun
    priority: med
    estimate: 2
    files:

    - /home/josh/projects/joshNews/.github/workflows/ci.yml

18. id: T018
    title: Lint and format checks in pre-commit
    description: Add Husky or simple pre-commit script to run `bun run format` and `bun run lint -- --fix` before commits.
    owner: developer-bun
    priority: low
    estimate: 1
    files:

    - /home/josh/projects/joshNews/package.json
    - /home/josh/projects/joshNews/.husky/\*

19. id: T019
    title: Add README quickstart for running tests and server
    description: Update quickstart with commands to run server, run contract tests, and start background jobs locally.
    owner: general
    priority: low
    estimate: 1
    files:

    - /home/josh/projects/joshNews/README.md
    - /home/josh/projects/joshNews/specs/001-a-website-accessible/quickstart.md

20. id: T020
    title: Add detailed API contracts (OpenAPI snippets)
    description: Author OpenAPI fragments for auth, sources, and dashboards to drive contract tests.
    owner: general
    priority: low
    estimate: 2
    files:

    - /home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/auth.yaml
    - /home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/sources.yaml
    - /home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/dashboards.yaml

21. id: T021
    title: Add observability hooks for request timing
    description: Add basic middleware to record request durations for dashboard endpoints for later perf tuning.
    owner: developer-bun
    priority: low
    estimate: 1
    files:

    - /home/josh/projects/joshNews/src/middleware/metrics.ts

22. id: T022
    title: E2E smoke test for primary user flow
    description: Add a simple E2E test that signs up via magic link, verifies, adds a source, and fetches dashboard.
    owner: general
    priority: low
    estimate: 3
    files:

    - /home/josh/projects/joshNews/tests/e2e/test_user_flow.smoke.test.ts

23. id: T023
    title: Add security review task for auth endpoints
    description: Review magic-link and verify endpoints for token leaks and ensure minimal cryptographic hygiene.
    owner: developer-bun
    priority: low
    estimate: 1
    files:

    - /home/josh/projects/joshNews/specs/001-a-website-accessible/security.md

24. id: T024
    title: Add tests for pagination and caps on sources listing
    description: Ensure GET /api/v1/sources supports pagination and caps with tests to prevent huge responses.
    owner: general
    priority: low
    estimate: 1
    files:

    - /home/josh/projects/joshNews/tests/contract/test_sources_pagination.test.ts

25. id: T025
    title: Polish type definitions and export surfaces
    description: Ensure all public modules have complete TypeScript types and re-export index files for clean imports.
    owner: developer-bun
    priority: low
    estimate: 2
    files:

    - /home/josh/projects/joshNews/src/models/index.ts
    - /home/josh/projects/joshNews/src/services/index.ts

26. id: T026
    title: Add changelog entry for feature kickoff
    description: Add an initial changelog record documenting Phase 3 tasks and key design decisions.
    owner: general
    priority: low
    estimate: 1
    files:
    - /home/josh/projects/joshNews/CHANGELOG.md

---

Generated: Phase 3 task list prepared following TDD ordering. Begin by implementing tasks T001-T005 (contract & unit tests) then proceed to T006-T010 (stubs/implementations) to make tests pass.
