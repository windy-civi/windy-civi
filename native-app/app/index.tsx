import { useEffect } from "react";
import WebView from "./components/WebView";
import { useLocalPushNotifications } from "./helpers/hooks/useLocalPushNotifications";

export default function Index() {
  const { initializeNotifications } = useLocalPushNotifications();

  useEffect(() => {
    const setupNotification = async () => {
      // Set the date for when you want the notification to fire
      const success = await initializeNotifications();

      if (success) {
        console.log("Notification scheduled successfully");
      }
    };

    setupNotification();
  }, []);

  return <WebView />;
}
