import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Default values for development
  const bundleId = process.env.EXPO_PUBLIC_BUNDLE_ID || "com.windycivi.dev";
  const androidPackage = process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "com.windycivi.dev";
  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || "development-project-id";

  // Only throw error if we're in production and missing env vars
  if (process.env.NODE_ENV === "production") {
    if (!process.env.EXPO_PUBLIC_BUNDLE_ID || 
        !process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 
        !process.env.EXPO_PUBLIC_PROJECT_ID) {
      console.error("Environment Setup Error:");
      console.error("For production builds, please set the following environment variables:");
      console.error("- EXPO_PUBLIC_BUNDLE_ID");
      console.error("- EXPO_PUBLIC_ANDROID_PACKAGE");
      console.error("- EXPO_PUBLIC_PROJECT_ID");
      console.error("\nCurrent values:");
      console.error(`BUNDLE_ID: ${process.env.EXPO_PUBLIC_BUNDLE_ID || "not set"}`);
      console.error(`ANDROID_PACKAGE: ${process.env.EXPO_PUBLIC_ANDROID_PACKAGE || "not set"}`);
      console.error(`PROJECT_ID: ${process.env.EXPO_PUBLIC_PROJECT_ID || "not set"}`);
      
      throw new Error("Production environment variables are not set");
    }
  }

  return {
    ...config,
    name: "WindyCivi",
    slug: "WindyCivi",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon-img.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-img.png",
      resizeMode: "contain",
      backgroundColor: "#ff1c7a",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon-img.png",
        backgroundColor: "#ffffff",
      },
      package: androidPackage,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon-img.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: projectId,
      },
    }
  };
};


