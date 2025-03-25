import { UserPreferences } from "../user-preferences";

export const SyncPushState = "SyncPushState";

export type Events = {
  type: typeof SyncPushState;
  payload: "granted" | "denied" | "prompt";
};

// https://github.com/expo/expo/issues/9591#issuecomment-1485871356
export const USER_PREFERENCES_CHANGED = "ON_USER_PREFERENCES_CHANGED";

export const publishUserPreferences = (userPreferences: UserPreferences) => {
  if ("ReactNativeWebView" in window) {
    // @ts-expect-error no types for react native webview
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: USER_PREFERENCES_CHANGED,
        payload: userPreferences,
      })
    );
  }
};
