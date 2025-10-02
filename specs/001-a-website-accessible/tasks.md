# Tasks: Dashboard Snapshot Feature

**Input**: Design documents from `/specs/001-a-website-accessible/`
**Prerequisites**: `plan.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Execution Flow (main)

1. Setup project skeleton and Bun + TypeScript tooling.
2. Write failing tests (contract + integration + unit) per TDD before implementing code.
3. Implement models, services, endpoints to make tests pass.
4. Integrate storage adapter (in-memory for tests, production adapter later).
5. Run lint/format and performance checks; finalize docs.

## Task List

T001 Create project structure per implementation plan

- Path: `/home/josh/projects/joshNews/`
- Description: Add directories: `src/`, `src/models/`, `src/services/`, `src/api/`, `src/adapters/storage/`, `tests/contract/`, `tests/feature/`, `tests/unit/`, `tests/perf/`.
- Dependencies: None

T002 Initialize project using Bun and TypeScript (BUN + TS config) [P]

- Path: `/home/josh/projects/joshNews/package.json`, `/home/josh/projects/joshNews/tsconfig.json`
- Description: Run `bun init` then add scripts: `build`, `lint`, `format`, `test`. Create `tsconfig.json` with constitution requirements (`strict: true`, `noImplicitAny: true`, `forceConsistentCasingInFileNames: true`, `module: "esnext"`, `target: "ES2022"`).
- Dependency: T001
- Parallelizable: yes (different files)
- Example Task agent command: Task("Initialize Bun and create tsconfig"), subagent: `@general`

T003 Configure ESLint and Prettier with TypeScript support [P]

- Path: `/home/josh/projects/joshNews/.eslintrc.json`, `/home/josh/projects/joshNews/.prettierrc`
- Description: Add ESLint + `@typescript-eslint` config and Prettier config. Add `lint` and `format` scripts to `package.json`.
- Dependency: T002
- Parallelizable: yes
- Command example: Task("Setup ESLint+Prettier" )

T004 [P] Add contract test for GET /api/v1/dashboards/{period} (failing) [X]

- Path: `/home/josh/projects/joshNews/tests/contract/test_get_dashboard_period.test.ts`
- Description: Create a contract test that calls `GET /api/v1/dashboards/daily` and `GET /api/v1/dashboards/weekly` and asserts the response schema matches `/specs/001-a-website-accessible/contracts/openapi.yaml`. Test must fail (no implementation yet).
- Dependency: T002
- Parallelizable: yes (contract tests are in separate files)
- Command example: Task("Create contract test for GET dashboard" )

T005 [P] Add model creation task for `User` entity

- Path: `/home/josh/projects/joshNews/src/models/user.ts`
- Description: Create TypeScript model for `User` with fields: `id: string`, `email: string`, `createdAt: string`, `lastActiveAt: string`, `preferences: Record<string, any>`. Include basic validation tests in `tests/unit/test_models.ts` (failing initially).
- Dependency: T001, T002
- Parallelizable: yes
- Command example: Task("Create User model")
- Status: Completed — implemented `src/models/user.ts` and unit tests pass.

T006 [P] Add model creation task for `ContentItem` entity

- Path: `/home/josh/projects/joshNews/src/models/contentItem.ts`
- Description: Create TypeScript model for `ContentItem` with fields: `id`, `title`, `source`, `publishedAt`, `ingestedAt`, `metadata`.
- Dependency: T001, T002
- Parallelizable: yes
- Command example: Task("Create ContentItem model")
- Status: Completed — implemented `src/models/contentItem.ts` and unit tests pass.

T007 [P] Add model creation task for `DashboardSnapshot` and `SnapshotItem`

- Path: `/home/josh/projects/joshNews/src/models/dashboardSnapshot.ts`
- Description: Create TypeScript models for `DashboardSnapshot` and `SnapshotItem` following `data-model.md` (include `period` enum, `items` array, `createdAt`). Ensure snapshot includes version field for optimistic locking.
- Dependency: T001, T002
- Parallelizable: yes
- Command example: Task("Create DashboardSnapshot model")

T008 Create integration test for quickstart scenario 'fetch cached snapshot' (failing)

- Path: `/home/josh/projects/joshNews/tests/feature/fetch_snapshot.test.ts`
- Description: Implement an integration test that simulates fetching a cached daily snapshot via `GET /api/v1/dashboards/daily` and verifies response contains `id, period, startAt, endAt, items` with correct shapes. Test must be written to fail until implementation exists.
- Dependency: T004, T007
- Parallelizable: no (shares files with other integration tests if present)
- Command example: Task("Create integration test fetch_cached_snapshot")

T009 Implement Dashboard service (read-only) in `src/services/dashboardService.ts`

- Path: `/home/josh/projects/joshNews/src/services/dashboardService.ts`
- Description: Implement service methods `getSnapshot(period: 'daily'|'weekly'): Promise<DashboardSnapshot | null>` that read from storage adapter. Start with in-memory adapter for tests.
- Dependency: T007, T011
- Parallelizable: no (depends on model file)
- Command example: Task("Implement DashboardService")
- Status: Completed — added `src/services/dashboardService.ts` with `getSnapshot(period)` delegating to the in-memory adapter.

T010 Implement GET /api/v1/dashboards/{period} endpoint

- Path: `/home/josh/projects/joshNews/src/api/dashboards.ts`
- Description: Add HTTP handler that calls `dashboardService.getSnapshot(period)` and returns 200 with snapshot or 404. Wire into app's routing entry (e.g., `src/api/index.ts` or `src/main.ts`).
- Dependency: T009
- Parallelizable: no
- Command example: Task("Implement GET dashboard endpoint")
- Status: Completed — added `src/api/dashboards.ts` and wired basic handler into `src/main.ts` for GET /api/v1/dashboards/{period}.

T011 Connect DashboardService to storage adapter (in-memory for tests)

- Path: `/home/josh/projects/joshNews/src/adapters/storage/memoryAdapter.ts`
- Description: Implement a simple in-memory adapter exposing `getSnapshot(period)` used by `DashboardService`. Seed with a sample snapshot used by contract/integration tests.
- Dependency: T007
- Parallelizable: yes
- Command example: Task("Add in-memory storage adapter")
- Status: Completed — `src/adapters/storage/memoryAdapter.ts` provides seeded daily and weekly snapshots and `getSnapshot`/`setSnapshot` helpers.

T012 Add unit tests for model validation

- Path: `/home/josh/projects/joshNews/tests/unit/test_models.ts`
- Description: Add unit tests that validate model serialization/validation for `User`, `ContentItem`, and `DashboardSnapshot`. Tests should initially fail if models are not implemented.
- Dependency: T005,T006,T007
- Parallelizable: yes
- Command example: Task("Add unit tests for models")

T013 Performance test: SSR render of cached snapshots <300ms p95

- Path: `/home/josh/projects/joshNews/tests/perf/test_ssr_perf.ts`
- Description: Create a lightweight performance test that measures a mock SSR render using cached snapshot and asserts p95 < 300ms. Use a small harness that can run in CI; mark as polish.
- Dependency: T010
- Parallelizable: no
- Command example: Task("Add SSR performance test")

T014 Update `quickstart.md` with test running instructions

- Path: `/home/josh/projects/joshNews/specs/001-a-website-accessible/quickstart.md`
- Description: Add commands: `bun install`, `bun run lint -- --fix`, `bun run format`, `bun test` and describe how to run the new contract and integration tests.
- Dependency: T002, T003, T004
- Parallelizable: yes
- Command example: Task("Update quickstart.md")

## Ordering & Dependencies Summary

- Setup: T001 → T002 → T003
- Tests (T004, T012) must be written and fail before T009-T010 implementation (TDD)
- Models: T005-T007 before DashboardService (T009)
- Storage adapter: T011 before DashboardService completes
- Integration tests: T008 requires T004 and T011
- Performance & Polish: T013, T014 after implementation

## Parallel Execution Groups (examples)

- Group A (can run simultaneously): T002, T003, T005, T006, T007
  - Example agent commands:
    - Task("Initialize Bun and tsconfig")
    - Task("Setup ESLint+Prettier")
    - Task("Create User model")
    - Task("Create ContentItem model")
    - Task("Create DashboardSnapshot model")
- Group B (contract tests): T004 (independent file)
- Group C (unit tests): T012 (independent)

## Actual Task Agent Commands

- Task("Initialize Bun and create tsconfig" , subagent_type="general")
- Task("Setup ESLint and Prettier", subagent_type="general")
- Task("Create contract test for GET /api/v1/dashboards/{period}", subagent_type="general")
- Task("Create DashboardSnapshot model and SnapshotItem", subagent_type="general")
- Task("Add in-memory storage adapter", subagent_type="general")

T015 [P] Add OpenAPI contract: auth (`auth.yaml`)

- Path: `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/auth.yaml`
- Description: Add OpenAPI definitions for `POST /api/v1/auth/magic-link` and `GET /api/v1/auth/verify`.
- Dependency: T002
- Parallelizable: yes

T016 [P] Add contract tests for auth

- Path: `/home/josh/projects/joshNews/tests/contract/test_auth_magic_link.test.ts`, `/home/josh/projects/joshNews/tests/contract/test_auth_verify.test.ts`
- Description: Failing contract test stubs for auth endpoints.
- Dependency: T015
- Parallelizable: yes

T017 [P] Add OpenAPI contract: sources (`sources.yaml`)

- Path: `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/sources.yaml`
- Description: Add OpenAPI definitions for `POST /api/v1/sources`, `GET /api/v1/sources`, `PUT /api/v1/sources/{id}`, `DELETE /api/v1/sources/{id}`.
- Dependency: T002
- Parallelizable: yes

T018 [P] Add contract tests for sources CRUD

- Path: `/home/josh/projects/joshNews/tests/contract/test_sources_crud.test.ts`
- Description: Failing contract test stubs for sources CRUD.
- Dependency: T017
- Parallelizable: yes

T019 [P] Add OpenAPI contracts: items/actions, leaderboard, export, jobs

- Path: `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/items.yaml`, `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/leaderboard.yaml`, `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/export.yaml`, `/home/josh/projects/joshNews/specs/001-a-website-accessible/contracts/jobs.yaml`
- Description: Add minimal OpenAPI definitions for item actions, leaderboard, export/delete, and job status endpoints.
- Dependency: T002
- Parallelizable: yes

T020 [P] Add contract tests for items/leaderboard/export/jobs

- Path: `/home/josh/projects/joshNews/tests/contract/test_items_actions.test.ts`, `/home/josh/projects/joshNews/tests/contract/test_leaderboard.test.ts`, `/home/josh/projects/joshNews/tests/contract/test_export_delete.test.ts`, `/home/josh/projects/joshNews/tests/contract/test_jobs_status.test.ts`
- Description: Failing contract test stubs for the above contracts.
- Dependency: T019
- Parallelizable: yes

## Validation Checklist

- [ ] Contract tests exist for every endpoint in `contracts/openapi.yaml` (T004)
- [x] Models exist for every entity in `data-model.md` up to T007 (T005-T007)
- [x] Tests written (T004, T008) and executed
- [ ] Parallel tasks are truly independent where marked [P]
- [ ] All tasks reference exact file paths

## Progress Tracking (automation)

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize project using Bun and TypeScript (BUN + TS config)
- [x] T003 Configure ESLint and Prettier with TypeScript support
- [x] T021 Create `Source` model and tests (scaffold)
- [x] T004 Add contract test for GET /api/v1/dashboards/{period} (failing)
- [x] T007 Create `DashboardSnapshot` model and tests
- [x] T009 Implement Dashboard service (read-only)
- [x] T010 Implement GET /api/v1/dashboards/{period}
- [x] T011 Connect DashboardService to storage adapter (in-memory for tests)
- [x] T022 Implement POST /api/v1/dashboards/{period}/refresh (completed)

T022: Implemented POST refresh endpoint, added dashboardService.refreshSnapshot, memoryAdapter.refreshSnapshot, and tests passing.

---

Generated from: `/home/josh/projects/joshNews/specs/001-a-website-accessible/plan.md` and supporting docs
