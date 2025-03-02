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
   npm start
   ```

   This will:

   - Copy local dependencies from the domain package
   - Start watching for changes in the domain package
   - Start the Expo development server

> **Important**: Always run these commands from the `native-app` directory, not from the root of the monorepo.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Environment Setup

For production builds, you need to set up environment variables:

1. Copy the template file:

```bash
cp .env.template .env
```

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
