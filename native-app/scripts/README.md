# Local Dependency Management Scripts

This directory contains scripts for managing local dependencies in the Windy Civi project.

## Why This Script Exists

This script was created to work around a limitation in Expo's handling of symlinks in monorepo setups. As documented in [Expo issue #22413](https://github.com/expo/expo/issues/22413), Expo has historically had problems with symlinked dependencies, particularly when using package managers like pnpm that rely heavily on symlinks.

In a typical monorepo setup, local packages would be symlinked into the node_modules directory, allowing for seamless development across packages. However, Expo's Metro bundler has had issues resolving these symlinks correctly, leading to errors during build and runtime.

This script provides a workaround by creating hard copies of the domain package instead of relying on symlinks. While this approach is less elegant than native symlink support, it ensures compatibility with Expo's build system while still allowing for local development across packages.

Note: Future versions of Expo (SDK 52+) may improve symlink support, potentially making this script unnecessary, but as of now, it remains the most reliable solution for working with local dependencies in an Expo project.

## copy-domain.js

This script copies the domain package from the root directory to the native-app's node_modules directory, making it available as a local dependency. It creates hard copies of files (not symlinks) to ensure compatibility with all build environments.

### Usage

You can use this script through the npm scripts defined in package.json:

```bash
# Copy domain files once
npm run copy-local-dependencies

# Copy domain files and watch for changes
npm run watch-domain
```

> **Important**: Always run these commands from the `native-app` directory, not from the root of the monorepo. Running from the wrong directory will result in "Cannot find module" errors.

### What it does

1. Copies all files from the `domain` directory to `native-app/node_modules/@windy-civi/domain` as hard copies (not symlinks)
2. Excludes `node_modules` and other unnecessary files
3. When run with `--watch`, it continuously monitors the domain directory for changes and automatically copies updated files
4. Uses rsync with the -L flag to resolve symlinks to their target files/directories
5. Falls back to a Node.js-based copy method if rsync fails or creates symlinks

### When to use

- After cloning the repository
- After pulling changes that include updates to the domain package
- During development when you're making changes to the domain package and want them reflected in the native app
- The `npm start` command automatically runs this script in watch mode

### Troubleshooting

If you encounter any issues:

1. Make sure the paths in the script match your project structure
2. Ensure you have the necessary permissions to read/write to the directories
3. Check that rsync is installed on your system
4. If you see symlinks instead of hard copies, try removing the node_modules/@windy-civi/domain directory manually and running the script again
