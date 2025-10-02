<!--
Sync Impact Report
- Version change: unspecified → 1.0.0
- Modified principles: Added I. Bun-First TypeScript; II. CLI-First Interfaces; III. Test-First (TDD) — NON-NEGOTIABLE; IV. Contracted Integration Testing; V. Observability, Versioning & Simplicity
- Added sections: Additional Constraints & Requirements; Development Workflow & Quality Gates; Governance (populated)
- Removed placeholders: all original bracketed principle/section placeholders replaced
- Templates updated: ✅ .specify/templates/plan-template.md; ✅ .specify/templates/spec-template.md; ✅ .specify/templates/tasks-template.md
- Templates missing / pending: ⚠ .specify/templates/commands/*.md (no files found) — manual review recommended
- Follow-up TODOs: TODO(RATIFICATION_DATE): set original adoption date in the constitution file
-->

# joshNews Constitution

<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Bun-First TypeScript

Projects MUST use Bun as the primary tooling surface for initialization, package management, building, linting, formatting, and testing. All developer-facing scripts and CI tasks should invoke Bun commands where feasible (e.g., `bun init`, `bun install`, `bun run build`, `bun run lint`, `bun run format`, `bun test`). Rationale: Standardizing on Bun reduces tooling divergence, shortens feedback loops, and aligns with the agent guidelines for deterministic, fast developer workflows.

### II. CLI-First Interfaces

Features and developer tools MUST expose a clear CLI surface where applicable, with stable stdin/args → stdout and stderr behavior. CLIs MUST support both human-readable output and a machine-friendly JSON mode (`--json`). Rationale: CLI-first design ensures automation-friendly workflows for agents and humans, simplifies testing, and guarantees reproducible text I/O for observability and debugging.

### III. Test-First (TDD) — NON-NEGOTIABLE

All production code MUST follow Test-Driven Development: write a failing test first, then implement the minimal code to make it pass, then refactor. Tests MUST be small, deterministic, and fast; external I/O and network interactions MUST be mocked. Test names MUST be descriptive (e.g., `should do X when Y`). Rationale: TDD guarantees design quality, prevents regressions, and is required by the agent workflow.

### IV. Contracted Integration Testing

Integration tests MUST validate public contracts: API endpoints, CLI behaviors, and inter-process messaging. For any change to a contract (API shape, CLI flags, output formats), corresponding contract tests MUST be updated and marked as failing until implementation completes. Rationale: Explicit contract tests protect downstream consumers and make breaking changes visible early.

### V. Observability, Versioning & Simplicity

- Observability: All runtime tools and services MUST emit structured logs (JSON) for machine parsing and human-readable summaries for operators. Errors MUST include contextual fields for easy triage.
- Versioning: The project MUST follow semantic versioning for public packages and APIs (MAJOR.MINOR.PATCH). Breaking changes MUST trigger a MAJOR bump and a documented migration plan.
- Simplicity: Solutions MUST favor clarity over cleverness; YAGNI applies — avoid premature generalization. Rationale: These combined principles keep systems maintainable, debuggable, and predictable for both humans and agents.

## Additional Constraints & Requirements

- Language and Tooling: TypeScript only (no runtime JS variants). `tsconfig.json` MUST include `"strict": true`, `"noImplicitAny": true`, `"forceConsistentCasingInFileNames": true`, `"module": "esnext"`, and `"target": "ES2022"`.
- Formatting & Linting: Prettier and ESLint with `@typescript-eslint` MUST be configured; `bun run format` and `bun run lint -- --fix` are required pre-commit steps.
- Security: Secrets MUST never be committed. Secrets management and environment handling MUST be documented in `quickstart.md`.
- Testing: Use Bun's test runner; tests MUST be deterministic and mock external services.
- CI: CI pipelines MUST run `bun install`, `bun run lint`, `bun run format --check`, and `bun test` on each PR.

## Development Workflow & Quality Gates

- Branching: Small, focused branches with imperative commit messages (e.g., `test: add failing test for X`, `feat: implement X`).
- Reviews: All changes MUST have at least one reviewer; PRs that modify public contracts or core principles require two reviewers, one of whom must be a maintainer.
- Quality Gates: PRs MUST pass linting, formatting checks, and all tests. Any new public API or contract change MUST include updated contract tests and a migration note.
- Agent Use: Agents and subagents MUST follow AGENTS.md guidance; primary agents MUST delegate subtasks to `@general` and `@developer-bun` where applicable.
- Commits: Include tests with each behavior change; do not merge failing tests.

## Governance

<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

All changes to this Constitution MUST be proposed as a specification PR with: 1) a clear summary of the change, 2) rationale, 3) migration plan for impacted consumers, and 4) tests and template updates that validate compliance. Amendments follow semantic versioning of the Constitution document itself:

- MAJOR: Incompatible redefinition or removal of core principles or governance clauses.
- MINOR: Addition of a new principle or material expansion of an existing principle that changes developer obligations.
- PATCH: Editorial clarifications, typos, or non-behavioral wording updates.

Approval process:

- Any amendment requires at least two reviewers; MAJOR amendments require at least one maintainer approval.
- The proposer MUST update the `Constitution Check` sections in `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, and `.specify/templates/tasks-template.md` as part of the PR.
- After merge, the proposer MUST run or document the migration steps, update the `Last Amended` date, and ensure CI templates reflect the change.

Compliance reviews:

- Every release cycle (or at least quarterly) the maintainers MUST run a constitution compliance audit: verify CI, templates, and a sample plan pass the Constitution Check. Failures must be tracked and remediated via issues.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): set original adoption date | **Last Amended**: 2025-10-01

<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
