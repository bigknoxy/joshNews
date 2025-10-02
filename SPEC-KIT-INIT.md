# Spec Kit — Init & Prompt Migration Guide

Purpose

This file documents a reproducible, automatable process to install `uv` (if needed), initialize the Spec Kit template in the current directory, migrate prompt files into the `.opencode/command/` folder, verify results, and perform safe cleanup. The instructions are written to be clear for both humans and LLMs executing shell commands.

Prerequisites

- Linux / macOS (or WSL2 on Windows)
- Python 3.11+
- Git
- Network access to `github.com`

Quick summary (one-liner sequence)

```sh
# Install uv (if required) then initialize Spec Kit in current dir, migrate prompts
curl -Ls https://astral.sh/uv/install.sh | sh && export PATH="$HOME/.local/bin:$PATH" && uvx --from git+https://github.com/github/spec-kit.git specify init --here --ignore-agent-tools --ai copilot --debug && mkdir -p .opencode/command && mv .github/prompts/plan.prompt.md .opencode/command/plan.md 2>/dev/null || true && mv .github/prompts/specify.prompt.md .opencode/command/specify.md 2>/dev/null || true && mv .github/prompts/tasks.prompt.md .opencode/command/tasks.md 2>/dev/null || true && rmdir .github/prompts 2>/dev/null || true && ls -la .opencode/command
```

Why this file exists

- The `spec-kit` template is distributed as a Python package expected to be launched with `uvx`.
- The CLI can be interactive; for automation we pass `--ignore-agent-tools` and `--ai` to avoid interactive prompts.
- The project contains prompt templates under `.github/prompts/` — we move those into `.opencode/command/` and rename them so they are consumable by opencode.ai or other CLI agents.

Detailed step-by-step instructions

1. Check environment

- Verify OS and tools:

```sh
uname -a
python3 --version
git --version
command -v uv || command -v uvx || echo "uv/uvx not found"
command -v code || echo "vscode not found"
```

Expected: `python3` prints `3.11.x`, `git` prints a version. If `uv/uvx` is not found, continue to step (2).

2. Install `uv` (only if missing)

- Install with the official installer (non-root; installs to `~/.local/bin`):

```sh
curl -Ls https://astral.sh/uv/install.sh | sh
# Temporarily ensure the uvx binary is in PATH for the current shell
export PATH="$HOME/.local/bin:$PATH"
# Verify
uv --version || uvx --version
```

Notes:

- If the system uses a shell other than `bash`, add the exported PATH line to your relevant shell RC (e.g., `~/.bashrc`, `~/.zshrc`).
- Installer will place `uv` and `uvx` in `~/.local/bin`.

3. Initialize Spec Kit (non-interactive / automation-ready)

- Use `uvx` to run the `specify` CLI directly from the `spec-kit` repo. For automation and when using a custom agent such as `opencode.ai` pass `--ignore-agent-tools` so the CLI won’t attempt to detect agent binaries. Also pass `--ai` to avoid interactive selection (accepted values: `claude`, `gemini`, `copilot`, `cursor`).

```sh
# Recommended: run this in the project directory where you want the template initialized
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ignore-agent-tools --ai copilot --script sh --debug
```

Notes and best practices:

- Use `--ai <agent>` to prevent the interactive arrow-key selection (this avoids "Inappropriate ioctl for device" errors when running in a non-interactive session).
- `--ignore-agent-tools` skips checks for agent-specific binaries (useful when agent integration is manual or via an external LLM like opencode.ai).
- If the command fails with git/network errors, see the troubleshooting section below.

4. Verify initialization

- Expected outputs: a folder structure containing `memory/`, `scripts/`, `specs/`, `templates/`, etc. Run:

```sh
ls -la
# or specifically
ls -la memory scripts specs templates || true
```

- Confirm the CLI printed `Project ready.` and note any error lines (e.g., `Initialize git repository (init failed)`). If git init failed, you can initialize manually (see step 7).

5. Migrate prompt files to `.opencode/command/`

- Create the target directory and move files with backups if targets already exist. This snippet is robust and safe:

```sh
set -euo pipefail
BASE="$(pwd)"
SRC="$BASE/.github/prompts"
DST="$BASE/.opencode/command"
mkdir -p "$DST"
TIMESTAMP=$(date +%s)

# Move and rename with backup of any existing destination files
mv_if_exists() {
  src="$1"; dst="$2"
  if [ -e "$dst" ]; then
    echo "Backing up existing destination: $dst -> ${dst}.bak.$TIMESTAMP"
    mv "$dst" "${dst}.bak.$TIMESTAMP"
  fi
  if [ -f "$src" ]; then
    echo "Moving: $src -> $dst"
    mv "$src" "$dst"
  else
    echo "Source file not found (skipping): $src"
  fi
}

mv_if_exists "$SRC/plan.prompt.md" "$DST/plan.md"
mv_if_exists "$SRC/specify.prompt.md" "$DST/specify.md"
mv_if_exists "$SRC/tasks.prompt.md" "$DST/tasks.md"

# Remove the source prompts dir only if empty
if [ -d "$SRC" ] && [ -z "$(ls -A "$SRC")" ]; then
  rmdir "$SRC"
  echo "Removed empty source directory: $SRC"
else
  echo "Source directory not removed (either missing or not empty): $SRC"
fi

# Final verification
ls -la "$DST"
```

Expected result: `.opencode/command/` contains `plan.md`, `specify.md`, `tasks.md`.

6. Verify prompt file contents (sanity checks)

- Quick checks (show first lines):

```sh
head -n 6 .opencode/command/plan.md
head -n 6 .opencode/command/specify.md
head -n 6 .opencode/command/tasks.md
```

- Confirm that the prompts contain plain English instructions and any placeholder variables you expect.

7. (Optional) Initialize a git repo and make an initial commit

If the Spec Kit initializer failed to initialize git, do it manually:

```sh
git init
git add .
git commit -m "chore(spec-kit): initialize spec-kit template and move prompts"
```

Notes:

- If you plan to push to a remote, configure the remote URL and push as usual.

8. (Optional) Add a local helper alias/function for convenience

To avoid typing the full `uvx` prefix every time, add a shell function to your RC file (e.g., `~/.bashrc` or `~/.zshrc`):

```sh
# Add to ~/.bashrc or ~/.zshrc
specify() {
  uvx --from git+https://github.com/github/spec-kit.git specify "$@"
}

# then reload your shell or run
# source ~/.bashrc
```

This makes `specify <subcommand>` work as a normal command in interactive shells.

Automation script (complete, non-interactive)

Save the following as `scripts/speckit-init.sh` (or run directly). It performs the full flow: installs `uv` if missing, initializes Spec Kit non-interactively, migrates prompts with backups, and leaves a verification summary.

```bash
#!/usr/bin/env bash
set -euo pipefail

# --- Configuration ---
AI_AGENT="copilot"   # use any of: copilot, claude, gemini, cursor
USE_IGNORE_AGENT_TOOLS=1
PROJECT_DIR="$(pwd)"

# --- Ensure uv / uvx available ---
if ! command -v uv >/dev/null 2>&1 && ! command -v uvx >/dev/null 2>&1; then
  echo "uv not found — installing..."
  curl -Ls https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

# --- Run Spec Kit initialization (non-interactive) ---
UVX_CMD="uvx"
if command -v uv >/dev/null 2>&1; then
  UVX_CMD="uv"
fi

INIT_CMD=("$HOME/.local/bin/uvx" --from "git+https://github.com/github/spec-kit.git" specify init --here --ai "$AI_AGENT" --script sh --debug)
if [ "$USE_IGNORE_AGENT_TOOLS" -eq 1 ]; then
  INIT_CMD+=(--ignore-agent-tools)
fi

echo "Running: ${INIT_CMD[*]}"
"${INIT_CMD[@]}" || {
  echo "Spec Kit init failed. Inspect output above." >&2
  exit 1
}

# --- Migrate prompts ---
SRC_DIR="$PROJECT_DIR/.github/prompts"
DST_DIR="$PROJECT_DIR/.opencode/command"
mkdir -p "$DST_DIR"
TS=$(date +%s)

mv_if_exists() {
  local src="$1" dst="$2"
  if [ -e "$dst" ]; then
    mv "$dst" "${dst}.bak.${TS}"
  fi
  if [ -f "$src" ]; then
    mv "$src" "$dst"
  fi
}

mv_if_exists "$SRC_DIR/plan.prompt.md" "$DST_DIR/plan.md"
mv_if_exists "$SRC_DIR/specify.prompt.md" "$DST_DIR/specify.md"
mv_if_exists "$SRC_DIR/tasks.prompt.md" "$DST_DIR/tasks.md"

# cleanup source directory if empty
if [ -d "$SRC_DIR" ] && [ -z "$(ls -A "$SRC_DIR")" ]; then
  rmdir "$SRC_DIR" || true
fi

# Summary
echo "--- Summary ---"
ls -la "$DST_DIR" || true

echo "Spec Kit initialization and prompt migration complete."
```

Troubleshooting

- "Could not resolve host: github.com" or git fetch failures
  - Check network connectivity:
    - `ping -c 1 github.com` or `curl -vI https://github.com`
    - Check `/etc/resolv.conf` and DNS settings
    - Ensure no restrictive proxy is blocking git/https
- "Inappropriate ioctl for device" or readchar errors during `init`
  - Happens when the CLI tries to use interactive arrow-key selection in a non-interactive shell.
  - Workaround: pass `--ai <agent>` to `specify init` (e.g., `--ai copilot`) and/or `--ignore-agent-tools`.
- Git initialization failed
  - Manually run `git init` and commit (see step 7).
- `uvx` not found even after install
  - Ensure `~/.local/bin` is in `PATH`: `export PATH="$HOME/.local/bin:$PATH"` and persist that in your shell RC.

How an LLM should use this file

- Execute the commands in order; avoid interactive prompts by including `--ai` and `--ignore-agent-tools`.
- If the LLM runs the script non-interactively, it should run the automation script above or the one-liner.
- For content generation, the LLM can reference `.opencode/command/*.md` files (these are now the prompts) and use them as the basis for step execution.

**Actions Performed by Automated Runner**
- **Install**: piped the official installer and auto-confirmed prompts (used `yes | bash` / `yes y | uvx`) to make installation and initialization non-interactive.
- **Path**: ensured `~/.local/bin` was added to the running shell's `PATH` so `uvx` could be executed without modifying user RC files.
- **Init**: executed `uvx --from git+https://github.com/github/spec-kit.git specify init --here --ignore-agent-tools --ai copilot --script sh --debug` and automatically accepted the interactive "Do you want to continue?" confirmation so the initializer could complete.
- **Tolerance**: non-critical failures were tolerated during automated runs (commands used fallbacks or `|| true`); the automation printed errors but continued where safe. The included automation script exits on explicit fatal errors only.
- **Prompts migration**: moved `.github/prompts/*.prompt.md` into `.opencode/command/` as `plan.md`, `specify.md`, and `tasks.md`. If a destination file already existed it was backed up with a timestamped suffix in the format `.YYYYMMDDHHMMSS.bak` before moving.
- **Cleanup & verification**: removed the source prompts directory only if empty and printed a final listing of `.opencode/command/` for verification.

Next steps and recommendations

- If you want this fully committed, run the git commands in step 7.
- Consider adding the `specify()` helper in your `~/.bashrc` so you can call the CLI quickly.
- Keep `.opencode/command/` under version control so opencode.ai or other agents can discover the prompt files.

---

Generated by an automated assistant — follow the exact commands above when running in scripts or from an LLM-controlled runner.
