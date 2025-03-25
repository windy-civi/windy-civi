import { WebView as NativeWebView } from "react-native-webview";
import { Linking } from "react-native";
import { useHandleWebBridgeMessage } from "../helpers/hooks/useHandleWebBridgeMessage";
export default function WebView() {
  const { handleWebBridgeMessage } = useHandleWebBridgeMessage();

  return (
    <NativeWebView
      source={{ uri: "https://windycivi.com/" }}
      bounces={false}
      overScrollMode="never"
      pullToRefreshEnabled={false}
      onMessage={handleWebBridgeMessage}
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
