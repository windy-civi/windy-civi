import { UserPreferences } from "@windy-civi/domain/types";

// Theres a monorepo issue with native apps that isn't allowing symlinked packages to work in react native.
// https://github.com/expo/expo/issues/9591#issuecomment-1485871356
export const USER_PREFERENCES_CHANGED = "ON_USER_PREFERENCES_CHANGED";

export const publishUserPreferences = (userPreferences: UserPreferences) => {
  if ("ReactNativeWebView" in window) {
    // @ts-expect-error no types for react native webview
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: USER_PREFERENCES_CHANGED,
        payload: userPreferences,
      }),
    );
  }
};
