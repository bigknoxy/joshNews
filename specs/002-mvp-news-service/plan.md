# Plan — 002 MVP News Service

Overview

Deliver the MVP across small branches using TDD. Each branch contains failing tests first, then implementation.

Sprints & Branches

- feature/mvp-init (1-2 days)

  - Add failing contract tests for `GET /sources` and `GET /items`.
  - Add failing CLI integration test for `run-fetch`.
  - Add spec files under `specs/002-mvp-news-service/`.

- feature/ingest-job (1-3 days)

  - Implement `ingestService` and `jobs/cliFetchRunner`.
  - Wire CLI `run-fetch` to ingest service.

- feature/api-items-sources (1-2 days)

  - Implement `GET /items` and `GET /sources` routes and ensure contract tests pass.

- feature/observability-json-logs (0.5-1 day)

  - Add structured JSON logging and tests for `--json` mode.

- chore/ci-bun-pipeline (0.5 day)
  - Ensure CI runs Bun-first commands and constitution compliance checklist.

Definition of Done (MVP)

- All must-have features implemented and covered by tests.
- Contract tests for API pass.
- CLI commands run and documented in `quickstart.md`.
- CI runs Bun-based steps and passes on PRs.
- Spec folder merged on `specs/002-mvp-news-service` branch with PR.
