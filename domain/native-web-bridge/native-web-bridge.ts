import { UserPreferences } from "../user-preferences";

// Sent from web to native
export const UPDATE_USER_PREFERENCES = "UPDATE_USER_PREFERENCES";
export const INITIALIZE_NATIVE_NOTIFICATIONS =
  "INITIALIZE_NATIVE_NOTIFICATIONS";
export const GET_NATIVE_NOTIFICATION_STATUS = "GET_NATIVE_NOTIFICATION_STATUS";

// Sent from native to web
export const NATIVE_BRIDGE_ERROR = "NATIVE_BRIDGE_ERROR";
export const SEND_NATIVE_NOTIFICATION_STATUS =
  "SEND_NATIVE_NOTIFICATION_STATUS";

type EventToPayloadMap = {
  [UPDATE_USER_PREFERENCES]: UserPreferences;
  [INITIALIZE_NATIVE_NOTIFICATIONS]: boolean;
  [GET_NATIVE_NOTIFICATION_STATUS]: boolean;
  [SEND_NATIVE_NOTIFICATION_STATUS]: string;
  [NATIVE_BRIDGE_ERROR]: Error;
};

export type Events = {
  [K in keyof EventToPayloadMap]: {
    type: K;
    payload: EventToPayloadMap[K];
  };
}[keyof EventToPayloadMap];

export type Callback = <T extends Events>(cb: T) => void;

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
