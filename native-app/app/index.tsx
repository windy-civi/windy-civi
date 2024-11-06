import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{ uri: "https://windycivi.com/" }}
      bounces={false}
      overScrollMode="never"
    />
  );
}
