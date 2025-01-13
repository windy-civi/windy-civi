import { useCallback, useEffect } from "react";
import {
  WebView as NativeWebView,
  WebViewMessageEvent,
} from "react-native-webview";
import { Linking } from "react-native";
import { onUserPreferences } from "../helpers/native-web-bridge";
import { useStorage } from "../helpers/hooks/useStorage";

export default function WebView() {
  const { storeData, getData } = useStorage();

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      onUserPreferences((userPreferences) => {
        storeData({
          key: "userPreferences",
          value: JSON.stringify(userPreferences),
        });
      }, event.nativeEvent.data);
    },
    [storeData]
  );

  useEffect(() => {
    getData({ key: "userPreferences" }).then((userPreferences) => {
      console.log("USER PREFERENCES", userPreferences);
    });
  }, [getData]);

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
