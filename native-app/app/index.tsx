import { WebView } from "react-native-webview";
import { Linking } from "react-native";

export default function Index() {
  return (
    <WebView
      source={{ uri: "http://192.168.251.118:5173/" }}
      bounces={false}
      overScrollMode="never"
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
