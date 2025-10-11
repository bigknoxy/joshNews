# 002 — MVP News Service

Version: 0.1.0
Ratified: 2025-10-10

Summary

This specification defines the Minimal Viable Product (MVP) for the joshNews ingestion and serving service. The MVP provides a Bun-first, TypeScript implementation that supports: managing sources, running a fetch job to ingest content into a local adapter, exposing minimal HTTP APIs to list sources and items, and a small CLI for developer automation. All work follows the project Constitution (see `.specify/memory/constitution.md`) and is developed using Test-Driven Development (TDD).

Scope

- CLI: `run-fetch`, `list-sources`, `serve` with `--json` (machine) mode.
- HTTP API: `GET /sources`, `GET /items`, `POST /jobs` (start), `GET /jobs/:id` (status).
- Storage: file adapter for local dev, memory adapter for tests.
- Observability: structured JSON logs optionally enabled via flags/env.

Constitution Check

- Bun-First: build/test/lint/format commands are Bun-based.
- TDD: every behavior is introduced with a failing test.
- Contract tests: API shapes are protected by contract tests in `specs/002-mvp-news-service/contracts` and `tests/contract`.
- Strict TypeScript: repository `tsconfig.json` remains strict.
- CI: workflows must run `bun install`, `bun run lint`, `bun run format --check`, `bun test`.

Goals

- Provide a small, well-tested codebase that demonstrates ingestion-to-storage flow.
- Provide clear docs and spec files so maintainers and downstream consumers understand contracts and migration surface.

Out of scope

- Production-grade scaling, external persistent DB (Postgres), rate-limiting, or advanced dashboards.
