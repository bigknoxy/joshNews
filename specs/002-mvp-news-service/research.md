# Research & Risks

- Risk: Existing tests assume different test runner; project currently references `bun:test` in many files. Ensure Bun is installed in CI.
- Risk: Some test helpers may import `bun:test` types not available in local dev; add dev instructions in quickstart.
- Research: integrate memory adapter for CI to ensure deterministic tests.
