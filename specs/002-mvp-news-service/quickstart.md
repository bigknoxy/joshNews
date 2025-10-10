# Quickstart — MVP News Service

Requirements

- Bun installed (https://bun.sh)
- Node not required for development; use Bun for scripts

Install

bun install

Run tests

TEST_STORAGE=memory bun test

Run CLI

# Run the fetch job using the CLI

TEST_STORAGE=memory bun run src/cli/index.ts run-fetch

# List sources (JSON)

TEST_STORAGE=memory bun run src/cli/index.ts list-sources --json

Run server locally

# Start server with file storage (default)

bun run src/main.ts

Notes

- Tests use the memory adapter when `TEST_STORAGE=memory` is set. See `tests/setup` for helpers.
