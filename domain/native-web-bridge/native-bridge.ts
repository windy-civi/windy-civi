import { UserPreferences } from "../user-preferences";

export const USER_PREFERENCES_CHANGED = "USER_PREFERENCES_CHANGED";
export const REQUEST_NATIVE_NOTIFICATION_PERMISSIONS =
  "REQUEST_NATIVE_NOTIFICATION_PERMISSIONS";
export const NATIVE_NOTIFICATION_STATUS_REQUESTED =
  "NATIVE_NOTIFICATION_STATUS_REQUESTED";

type EventToPayloadMap = {
  [USER_PREFERENCES_CHANGED]: UserPreferences;
  [REQUEST_NATIVE_NOTIFICATION_PERMISSIONS]: boolean;
  [NATIVE_NOTIFICATION_STATUS_REQUESTED]: boolean;
};

export type Events = {
  [K in keyof EventToPayloadMap]: {
    type: K;
    payload: EventToPayloadMap[K];
  };
}[keyof EventToPayloadMap];

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
