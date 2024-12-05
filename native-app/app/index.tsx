import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Linking } from "react-native";
import { onUserPreferences } from "./native-web-bridge";

export default function Index() {
  console.log("DO WE HAVE LOGS");
  return (
    <WebView
      source={{ uri: "http://192.168.251.181:5173/" }}
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

const handleMessage = (event: WebViewMessageEvent) => {
  console.log("HELLO");
  onUserPreferences((userPreferences) => {
    alert("RECEIVED USER PREFERENCES" + JSON.stringify(userPreferences));
  }, event.nativeEvent.data);
};
