IMPORTANT: ⚠️ IMPORTANT: Always prefer using subagents `@general` and `@developer-bun` (the latter will be created soon) to perform subtasks. Use subagents in parallel for non-overlapping tasks, up to 5 parallel agents at a time. THIS IS MANDATORY — primary agents MUST delegate appropriate subtasks to these subagents by default. Failure to follow these rules is non-compliance and will be considered failing.

## Keeping Answers Short and Concise ✂️
- KEEP responses short and direct by default — no fluff. ✅
- DO NOT add filler; state actionable next steps and decisions. 🔍
- If a longer explanation is required, START with a 1–2 line summary, then add a labeled "Detailed explanation" section.
- When unsure, ASK the user if they want a short summary or a detailed explanation.

AGENTS — Agent Guidelines (Bun + TypeScript + TDD)

Build / Lint / Test Commands (Bun-First — MANDATORY)
- ALWAYS use Bun for project tasks. Use `bun init`, `bun install`, `bun run build`, `bun run lint`, `bun run format`, and `bun test` as the default workflow. Do not use `npm`, `pnpm`, or `yarn` unless explicitly authorized.
- Initialize project: `bun init` (creates `package.json` and basic scripts).
- Install deps: `bun install`.
- Build: `bun run build` (ensure `build` script exists in `package.json`).
- Lint: `bun run lint` (ESLint + `@typescript-eslint`).
- Format: `bun run format` (Prettier).
- Test: `bun test` (use Bun’s test runner configured for TypeScript).
- Run a single test: `bun test path/to/test.test.ts -t "test name"` or `bun test --filter "regex"`.

TDD and Workflow Rules (MANDATORY)
- YOU MUST follow Test-Driven Development: write a failing test first, then implement the minimal code to make it pass. No exceptions.
- Keep tests small, deterministic, and fast; mock external I/O and network.
- Use descriptive test names: `should do X when Y`.
- Use the todo tool to plan multi-step development and mark tasks complete as you proceed.

TypeScript & Project Settings (STRICT)
- Language: TypeScript only. Projects MUST use a `tsconfig.json` with: `"strict": true`, `"noImplicitAny": true`, `"forceConsistentCasingInFileNames": true`, `"module": "esnext"`, `"target": "ES2022"`.
- Public APIs MUST be fully typed; prefer explicit return and param types; avoid `any` entirely unless explicitly documented and justified.
- Use `paths` in `tsconfig` for clean absolute imports when helpful.

Code Style Guidelines (ENFORCED)
- ALWAYS run Prettier via `bun run format` before commits; include Prettier config in the repo.
- ALWAYS run ESLint and fix issues: `bun run lint -- --fix` as needed.
- Imports must be grouped and sorted: 1) standard/stdlib, 2) third-party, 3) internal.
- Naming: `camelCase` for variables/functions, `PascalCase` for types/classes/interfaces, `UPPER_SNAKE` for compile-time constants.
- NEVER swallow errors; return or rethrow with context (use typed error shapes). Centralize common error construction/utilities.
- Keep files focused and easy to read; prefer <550 lines — split files when needed.
- Prefer small, single-responsibility functions. Clarity over cleverness.

Commits & PRs (MANDATORY)
- Make small, focused commits. Follow imperative messages: e.g., first `test: add failing test for X`, then `feat: implement X`.
- All code changes MUST include a test that demonstrates the behavior.

Context7 Usage
- Agents MAY use `context7_resolve_library_id` and `context7_get_library_docs` to fetch up-to-date examples and docs when implementing features or finding patterns. Use conservatively and with documented intent.

Cursor / Copilot rules
- Report the absence or addition of `.cursor/rules/` or `.cursorrules` files in the repo root.
- Report the absence or addition of `.github/copilot-instructions.md` and ensure agents read and honor them.

Notes (FINAL)
- The repository is Bun-first and TypeScript-strict. You MUST follow these rules.
- Failure to follow these rules is failing. If you do not follow these rules, you are failing and must correct course immediately.
- Ask before introducing build-system or dependency changes that affect CI or developer environments.
