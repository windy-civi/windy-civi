import { useCallback } from "react";
import { WebViewMessageEvent } from "react-native-webview";
import {
  parseEvent,
  USER_PREFERENCES_CHANGED,
  REQUEST_NATIVE_NOTIFICATION_PERMISSIONS,
  NATIVE_NOTIFICATION_STATUS_REQUESTED,
  Events,
} from "@windy-civi/domain/native-web-bridge/native-bridge";
import { useStorage } from "./useStorage";
import { useLocalPushNotifications } from "./useLocalPushNotifications";
import { useBackgroundFetch } from "./useBackgroundFetch";
export const useHandleWebBridgeMessage = () => {
  const { storeData } = useStorage();
  const { initializeNotifications, getNotificationStatus } =
    useLocalPushNotifications();
  const { isRegistered, toggleFetchTask } = useBackgroundFetch();

  const handleWebBridgeMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const e = parseEvent(event.nativeEvent.data);
      if (!e) {
        throw new Error("Invalid event");
      }

      const sideEffects = async (
        type: Events["type"],
        payload: Events["payload"]
      ) => {
        switch (type) {
          case USER_PREFERENCES_CHANGED:
            storeData({
              key: "userPreferences",
              value: JSON.stringify(payload),
            });
            break;
          case REQUEST_NATIVE_NOTIFICATION_PERMISSIONS:
            const success = await initializeNotifications();
            if (success) {
              console.log("Notification scheduled successfully");
            }
            if (!isRegistered) {
              await toggleFetchTask();
              console.log("Background fetch task registered");
            }
            break;
          case NATIVE_NOTIFICATION_STATUS_REQUESTED:
            const status = await getNotificationStatus();
            break;
          default:
            throw new Error(`Unknown event type: ${type}`);
        }
      };

      sideEffects(e.type as Events["type"], e.payload);
    },
    [
      storeData,
      initializeNotifications,
      isRegistered,
      getNotificationStatus,
      toggleFetchTask,
    ]
  );

  return { handleWebBridgeMessage };
};
