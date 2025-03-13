import { useCallback } from "react";
import {
  WebView as NativeWebView,
  WebViewMessageEvent,
} from "react-native-webview";
import { Linking } from "react-native";
import {
  parseEvent,
  USER_PREFERENCES_CHANGED,
  REQUEST_NATIVE_NOTIFICATION_PERMISSIONS,
  NATIVE_NOTIFICATION_STATUS_REQUESTED,
  Events,
  UserPreferencesChangedEvent,
} from "@windy-civi/domain/native-web-bridge/native-bridge";
import { useStorage } from "../helpers/hooks/useStorage";

export default function WebView() {
  const { storeData } = useStorage();

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const e = parseEvent(event.nativeEvent.data);
      if (!e) {
        throw new Error("Invalid event");
        // TODO: handle error
      }

      // Define side effects. Type should force exhaustive checking of events
      const sideEffects = <T extends Events>(
        type: T["type"],
        payload: T["payload"]
      ): T["type"] => {
        switch (type) {
          case USER_PREFERENCES_CHANGED:
            storeData({
              key: "userPreferences",
              value: JSON.stringify(payload),
            });
            return USER_PREFERENCES_CHANGED;
          case REQUEST_NATIVE_NOTIFICATION_PERMISSIONS:
            return REQUEST_NATIVE_NOTIFICATION_PERMISSIONS;
          case NATIVE_NOTIFICATION_STATUS_REQUESTED:
            return NATIVE_NOTIFICATION_STATUS_REQUESTED;
          default:
            throw new Error(`Unknown event type: ${type}`);
        }
      };

      // Run the side effect
      sideEffects(e.type, e.payload);
    },
    [storeData]
  );

  return (
    <NativeWebView
      source={{ uri: "https://windycivi.com/" }}
      bounces={false}
      overScrollMode="never"
      pullToRefreshEnabled={false}
      onMessage={handleMessage}
      onShouldStartLoadWithRequest={(event) => {
        if (event.navigationType === "click" && event.url) {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }}
    />
  );
}
