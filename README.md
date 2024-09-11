# Windy Civi

## Start Development

The development assumes you are using Github Codespaces. Shoot up an instance and it should just work.

## Folder Structure

The codebase follows monorepo behavior, but doesn't use any workspaces (like Yarn Workspaces or similar). It mostly depends on relative imports or `paths` in `tsconfig.json`. Each repo has it's own package.json, with the goal to make things mostly portable.

By being a monorepo, we prioritize making PR management unified, and also making global refactors easier.

### Folders

- `.devcontainer`: For setting up GitHub Codespaces.
- `.github`: We use GitHub Actions for all CI, including running scrapers & checking code quality.
- `.vscode`: Recommended settings for vscode.
- `domain`: Core business logic (should not have external dependencies, and just focuses on data logic/types/transformations). See [domain driven design](https://en.wikipedia.org/wiki/Domain-driven_design).
- `pwa`: Progress Web App built on React/Tailwind/TypeScript/Vite.
- `scraper`: Make the data, including get GPT summaries.
- `setup.sh`: Installs all the modules.
