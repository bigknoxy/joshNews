# quickstart.md

This quickstart describes how to run the feature's contract tests and a minimal local flow.

1. Install Bun if not already installed: visit https://bun.sh
2. In repo root: `bun init` to create `package.json` and `bun.lockb`.
3. Run `bun install` to install dependencies.
4. Run `bun test` to execute tests.

Notes:

- Tests for this feature will be added under `tests/feature/dashboard`.
- The project constitution requires `bun run lint`, `bun run format --check`, and `bun test` in CI.
