import { useCallback } from "react";
import { WebViewMessageEvent, WebView } from "react-native-webview";
import {
  parseEvent,
  UPDATE_USER_PREFERENCES,
  INITIALIZE_NATIVE_NOTIFICATIONS,
  GET_NATIVE_NOTIFICATION_STATUS,
  NATIVE_BRIDGE_ERROR,
  Events,
  SEND_NATIVE_NOTIFICATION_STATUS,
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
          case UPDATE_USER_PREFERENCES:
            try {
              storeData({
                key: "userPreferences",
                value: JSON.stringify(payload),
              });
              // no need to send a response back to the web app
            } catch (error) {
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: NATIVE_BRIDGE_ERROR,
                  payload: error,
                })
              );
            }
            break;
          case INITIALIZE_NATIVE_NOTIFICATIONS:
            try {
              await initializeNotifications();
              if (!isRegistered) {
                await toggleFetchTask();
              }
              const status = await getNotificationStatus();

              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: SEND_NATIVE_NOTIFICATION_STATUS,
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
          case GET_NATIVE_NOTIFICATION_STATUS:
            try {
              const status = await getNotificationStatus();
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: SEND_NATIVE_NOTIFICATION_STATUS,
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
