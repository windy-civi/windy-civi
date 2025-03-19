# Windy Civi

## Start Development

**Easiest:** The development assumes you are using Github Codespaces. Shoot up an instance and it should just work.

If wanting to develop outside GitHub Codespaces, run `npm install` on whichever package you want. '

## Folder Structure

The codebase follows monorepo behavior, but doesn't use any workspaces (like Yarn Workspaces or similar). It mostly depends on relative imports or `paths` in `tsconfig.json`. Each repo has it's own package.json, with the goal to make things mostly portable.

By being a monorepo, we prioritize making PR management unified, and also making global refactors easier.

### Folders

- [`.devcontainer`](.devcontainer): For setting up GitHub Codespaces.
- [`.github`](.github): We use GitHub Actions for all CI, including running scrapers & checking code quality.
- [`.vscode`](.vscode): Recommended settings for vscode.
- [`domain`](domain): Core business logic. See [domain driven design](https://en.wikipedia.org/wiki/Domain-driven_design).
- [`web-app`](web-app): Progressive Web App built on React/Tailwind/TypeScript/Vite.
- [`native-app`](native-app): Expo React Native App. Local development won't work on codespaces.
- [`scraper`](scraper): Make the data, including get GPT summaries.
- [`storage`](storage): For getting/writing data from github releases / the filesystem.
