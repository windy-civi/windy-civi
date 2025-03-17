import { ActionFunction, json } from "react-router-dom";
import { UserPreferences } from "@windy-civi/domain/types";
import { publishUserPreferences } from "../native-web-bridge/native-web-bridge";
import { savePreferencesToCookies } from "./utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const validatedPreferences = validate({
    location: formData.get("location"),
    tags: formData.get("tags"),
    representatives: formData.get("representatives"),
    theme: formData.get("theme"),
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
