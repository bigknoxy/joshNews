### Summary

Provide a short, human-readable one-line summary of what the PR changes and why.

---

### What changed (high level)

- Concise bullets describing the main changes (API surface, tests added, major services/adapters).
- Prefer referencing task IDs or spec numbers (e.g., T001, spec:001-a-website-accessible).
- Avoid listing every file — focus on intent and surface-level impact.

---

### Motivation

A brief sentence explaining why these changes were made and what problem they solve.

---

### How to verify / test locally

1. `bun install`
2. `bun test`
3. `bun run format`
4. `bun run lint`

If extra steps are required for this PR (e.g., environment variables, running a job, or a specific test), list them here.

**Testing notes for contributors (important):**

- Some tests rely on environment variables to select adapters (for example `USE_FILE_ADAPTER` and `SNAPSHOT_STORAGE_DIR`). Set these environment variables before importing application modules in tests. Prefer dynamic imports in tests when you need to set env vars at runtime.
- Pattern to follow in tests:
  ```ts
  // set env BEFORE importing service/module
  process.env.USE_FILE_ADAPTER = 'true';
  process.env.SNAPSHOT_STORAGE_DIR = path.resolve('tests/tmp', `snapshots-${Date.now()}`);
  const mod = await import('../../src/services/dashboardService');
  const DashboardService = mod.DashboardService;
  ```
- Avoid relying on module import-time side effects for selecting adapters; prefer constructor-level flags or factory functions that read env vars at runtime.

---

### Deployment / rollout notes

- Any DB migrations, config flags, or feature flags required.
- Backwards compatibility or migration concerns.

---

### Impact

- User-visible changes, breaking changes, perf or storage implications, or API contract changes.
- If low-risk, state that this is non-breaking.

---

### Related

- Link to related issue(s), spec(s), or tasks: e.g., `specs/001-a-website-accessible`, `T001-T026`.

---

### Checklist for author

- [ ] Tests added/updated where appropriate
- [ ] Lint and format applied (`bun run format`, `bun run lint`)
- [ ] No secrets or sensitive data included
- [ ] CI is green

---

### Reviewer guidance

- Focus review on API contract tests and any areas marked as TODO or stubbed implementations.
- Call out any areas that need follow-up work (scoring, production persistence, integrations).
