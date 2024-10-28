import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{ uri: "https://sartaj.me/windy-civi" }}
      bounces={false}
      overScrollMode="never"
    />
  );
}
