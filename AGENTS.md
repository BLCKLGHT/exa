# EXA repository instructions

## Git workflow

- Treat committing and pushing completed user-requested changes as part of the default workflow.
- After relevant validation succeeds, commit the scoped changes and push the current branch to `origin`.
- Do not wait for a separate “commit” or “push” request unless the user explicitly asks to keep changes local.
- Never include secrets, local environment files, generated credentials, or unrelated worktree changes in a commit.
- If a commit or push is blocked by authentication, branch protection, conflicts, or failing validation, report the blocker clearly instead of bypassing it.
