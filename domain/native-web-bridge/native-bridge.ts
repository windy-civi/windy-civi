import { UserPreferences } from "../types";

export const USER_PREFERENCES_CHANGED = "ON_USER_PREFERENCES_CHANGED";
export const REQUEST_NATIVE_NOTIFICATION_PERMISSIONS =
  "REQUEST_NATIVE_NOTIFICATION_PERMISSIONS";
export const NATIVE_NOTIFICATION_STATUS_REQUESTED =
  "ON_NATIVE_NOTIFICATION_STATUS_REQUESTED";

export type UserPreferencesChangedEvent = {
  type: typeof USER_PREFERENCES_CHANGED;
  payload: UserPreferences;
};

export type Events =
  | UserPreferencesChangedEvent
  | {
      type: typeof REQUEST_NATIVE_NOTIFICATION_PERMISSIONS;
    }
  | {
      type: typeof NATIVE_NOTIFICATION_STATUS_REQUESTED;
    };

export type Callback = <T extends Events>(cb: T) => void;

export const onUserPreferences = (
  cb: (u: UserPreferences) => void,
  action: unknown
) => {
  const parsedAction = parseEvent(action);
  if (parsedAction && parsedAction.type === USER_PREFERENCES_CHANGED) {
    cb(parsedAction.payload);
  }
};

export const parseEvent = (action: unknown): Events | null => {
  try {
    if (typeof action === "string") {
      const parsedJSON = JSON.parse(action);
      if (isEvent(parsedJSON)) {
        return parsedJSON;
      }
    }
  } catch (e) {
    console.error("Error parsing action", { cause: e });
    return null;
  }
  return null;
};

const isEvent = (action: unknown): action is Events => {
  return typeof action === "object" && action !== null && "type" in action;
};
