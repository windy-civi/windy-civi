# Welcome to WindyCivi Native 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Install Expo CLI

   ```bash
   npm install -g expo-cli
   ```

3. Login to Expo (make sure account is linked to WindyCivi Project)

   ```bash
   npx expo login
   ```

4. Create .env.local file

5. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Local Dependency Management

This project uses local dependencies from the monorepo structure. To ensure these dependencies are properly linked:

- When you run `npm start`, the domain package is automatically copied and watched for changes.

- If you need to copy the domain package manually (one-time):

  ```bash
  npm run copy-local-dependencies
  ```

- If you need to watch for changes in the domain package separately:

  ```bash
  npm run watch-domain
  ```

> **Note**: All commands must be run from the `native-app` directory. If you see "Cannot find module" errors, make sure you're in the correct directory.

This setup automatically copies any changes made to the domain package to the native-app's node_modules directory, ensuring your changes are immediately reflected in the app.

### Why Not Use Symlinks?

This project uses a custom script to copy files instead of symlinks due to [Expo issue #22413](https://github.com/expo/expo/issues/22413). Expo's Metro bundler has historically had problems with symlinked dependencies in monorepo setups, leading to build and runtime errors.

Our solution creates hard copies of the domain package and watches for changes, providing a reliable workaround while maintaining a good developer experience. Future versions of Expo may improve symlink support, but for now, this approach ensures compatibility with all build environments.
