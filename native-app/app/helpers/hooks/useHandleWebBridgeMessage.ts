import { useCallback } from "react";
import { WebViewMessageEvent, WebView } from "react-native-webview";
import {
  parseEvent,
  USER_PREFERENCES_CHANGED,
  REQUEST_NATIVE_NOTIFICATION_PERMISSIONS,
  NATIVE_NOTIFICATION_STATUS_REQUESTED,
  NATIVE_BRIDGE_ERROR,
  Events,
} from "@windy-civi/domain/native-web-bridge/native-web-bridge";
import { useStorage } from "./useStorage";
import { useLocalPushNotifications } from "./useLocalPushNotifications";
import { useBackgroundFetch } from "./useBackgroundFetch";

export const useHandleWebBridgeMessage = (
  webViewRef: React.RefObject<WebView>
) => {
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
            try {
              storeData({
                key: "userPreferences",
                value: JSON.stringify(payload),
              });
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: USER_PREFERENCES_CHANGED,
                  payload: "Successfully updated user preferences!",
                })
              );
            } catch (error) {
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: NATIVE_BRIDGE_ERROR,
                  payload: error,
                })
              );
            }
            break;
          case REQUEST_NATIVE_NOTIFICATION_PERMISSIONS:
            try {
              await initializeNotifications();
              if (!isRegistered) {
                await toggleFetchTask();
              }
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: REQUEST_NATIVE_NOTIFICATION_PERMISSIONS,
                  payload:
                    "Successfully requested native notification permissions!",
                })
              );
            } catch (error) {
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: NATIVE_BRIDGE_ERROR,
                  payload: error,
                })
              );
            }
            break;
          case NATIVE_NOTIFICATION_STATUS_REQUESTED:
            try {
              const status = await getNotificationStatus();
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: NATIVE_NOTIFICATION_STATUS_REQUESTED,
                  payload: status,
                })
              );
            } catch (error) {
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: NATIVE_BRIDGE_ERROR,
                  payload: error,
                })
              );
            }
            break;
          default:
        }
      };

      sideEffects(e.type as Events["type"], e.payload);
    },
    [
      webViewRef,
      storeData,
      initializeNotifications,
      isRegistered,
      getNotificationStatus,
      toggleFetchTask,
    ]
  );

  return { handleWebBridgeMessage };
};
