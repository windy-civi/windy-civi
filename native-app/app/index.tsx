import { useEffect } from "react";
import WebView from "./components/WebView";
import { useLocalPushNotifications } from "./helpers/hooks/useLocalPushNotifications";
import BackgroundFetchScreen from "./helpers/hooks/useBackgroundFetch";

export default function Index() {
  const { initializeNotifications } = useLocalPushNotifications();
  const { toggleFetchTask, isRegistered } = BackgroundFetchScreen();

  useEffect(() => {
    const setupApp = async () => {
      // Initialize notifications
      const success = await initializeNotifications();
      if (success) {
        console.log("Notification scheduled successfully");
      }

      // Initialize background fetch
      if (!isRegistered) {
        await toggleFetchTask();
        console.log("Background fetch task registered");
      }
    };

    setupApp();
  }, []);

  return <WebView />;
}
