import { UPDATE_USER_PREFERENCES } from "@windy-civi/domain/native-web-bridge/native-web-bridge";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { ActionFunction, json } from "react-router-dom";
import { savePreferencesToCookies } from "./api";

export const publishUserPreferences = (userPreferences: UserPreferences) => {
  if ("ReactNativeWebView" in window) {
    // @ts-expect-error no types for react native webview
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: UPDATE_USER_PREFERENCES,
        payload: userPreferences,
      }),
    );
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const validatedPreferences = validate({
    location: formData.get("location"),
    tags: formData.get("tags"),
  });

  // Save preferences to cookies
  savePreferencesToCookies(validatedPreferences);

  // Notify native app of preference changes
  publishUserPreferences(validatedPreferences);

  return json({ success: true });
};

// todo: validate preferences
const validate = (
  preferences: Partial<
    Record<keyof UserPreferences, unknown> // dont assume values here. assert.
  >,
): UserPreferences => {
  return preferences as UserPreferences;
};
