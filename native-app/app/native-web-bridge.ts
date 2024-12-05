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
  if (isAction(action) && action.type === USER_PREFERENCES_CHANGED) {
    cb(action.payload);
  }
};

const isAction = (action: unknown): action is Actions => {
  return typeof action === "object" && action !== null && "type" in action;
};
