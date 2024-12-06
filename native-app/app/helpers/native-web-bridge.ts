import { UserPreferences } from "@windy-civi/domain/types";

export const USER_PREFERENCES_CHANGED = "ON_USER_PREFERENCES_CHANGED";

type Actions = {
  type: typeof USER_PREFERENCES_CHANGED;
  payload: UserPreferences;
};

export const onUserPreferences = (
  cb: (u: UserPreferences) => void,
  action: unknown
) => {
  const parsedAction = parseAction(action);
  if (parsedAction && parsedAction.type === USER_PREFERENCES_CHANGED) {
    cb(parsedAction.payload);
  }
};

const parseAction = (action: unknown): Actions | null => {
  try {
    if (typeof action === "string") {
      const parsedJSON = JSON.parse(action);
      if (isAction(parsedJSON)) {
        return parsedJSON;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
};

const isAction = (action: unknown): action is Actions => {
  return typeof action === "object" && action !== null && "type" in action;
};
