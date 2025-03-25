import { useEffect, useState } from "react";
import { classNames } from "../../design-system/styles";
import { PWAInstall } from "./PwaInstaller";
import AppleAppStoreIcon from "./assets/apple-app-store.svg";
import GooglePlayIcon from "./assets/google-play.svg";

// Environment detection
const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
};

const isNativeWebView = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /wv/.test(userAgent) || /webview/.test(userAgent);
};

// Notification permission states
type NotificationPermission =
  | "granted"
  | "denied"
  | "prompt"
  | "not-determined";
type ExpoNotificationStatus =
  | "not-determined"
  | "denied"
  | "authorized"
  | "provisional"
  | "ephemeral";

interface NotificationPreferencesProps {
  className?: string;
}

// Native App Installation Options
const NativeAppInstallation = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-white">
        <p>
          To get notifications, install the iOS or Android app from the App
          Store.
        </p>
        <div className="mt-2 space-y-4">
          <a
            href="https://apps.apple.com/us/app/windy-civi/id6737817607"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={AppleAppStoreIcon}
              alt="Download on the App Store"
              className="h-10"
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.windycivi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={GooglePlayIcon}
              alt="Get it on Google Play"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

// WebView Notification Status
const WebViewNotificationStatus = ({
  status,
  onRequestPermission,
}: {
  status: ExpoNotificationStatus | null;
  onRequestPermission: () => void;
}) => {
  switch (status) {
    case "not-determined":
      return (
        <div className="text-sm text-gray-600">
          <p>
            Enable notifications to get updates about legislation you care
            about.
          </p>
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={onRequestPermission}
          >
            Enable Notifications
          </button>
        </div>
      );
    case "denied":
      return (
        <div className="text-sm text-red-600">
          <p>
            Notifications are blocked. Please enable them in your device
            settings.
          </p>
        </div>
      );
    case "authorized":
    case "provisional":
    case "ephemeral":
      return (
        <div className="text-sm text-green-600">
          <p>
            Notifications are enabled! You'll receive updates about legislation
            you care about.
          </p>
        </div>
      );
    default:
      return null;
  }
};

// Web PWA Notification Status
const WebPWANotificationStatus = ({
  permission,
  onRequestPermission,
}: {
  permission: NotificationPermission;
  onRequestPermission: () => void;
}) => {
  switch (permission) {
    case "granted":
      return (
        <div className="text-sm text-green-600">
          <p>
            Notifications are enabled! You'll receive updates about legislation
            you care about.
          </p>
        </div>
      );
    case "denied":
      return (
        <div className="text-sm text-red-600">
          <p>
            Notifications are blocked. Please enable them in your browser
            settings.
          </p>
        </div>
      );
    case "prompt":
    case "not-determined":
      return (
        <div className="text-sm text-gray-600">
          <p>
            Enable notifications to get updates about legislation you care
            about.
          </p>
          <button
            className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={onRequestPermission}
          >
            Enable Notifications
          </button>
        </div>
      );
    default:
      return null;
  }
};

export const NotificationPreferences: React.FC<
  NotificationPreferencesProps
> = ({ className }) => {
  const [permission, setPermission] =
    useState<NotificationPermission>("not-determined");
  const [expoStatus, setExpoStatus] = useState<ExpoNotificationStatus | null>(
    null,
  );
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);

  useEffect(() => {
    // Check if we're in standalone mode
    setIsStandaloneMode(isStandalone());

    // Check notification permissions
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);

      // Listen for permission changes
      Notification.requestPermission().then((result) => {
        setPermission(result as NotificationPermission);
      });
    }

    // Check if we're in a WebView and get Expo notification status
    if (isNativeWebView()) {
      // This would be handled by the native bridge
      // For now, we'll simulate it
      setExpoStatus("not-determined");
    }
  }, []);

  const handleWebViewPermissionRequest = () => {
    // This would trigger the native bridge to request permissions
    setExpoStatus("authorized");
  };

  const handleWebPermissionRequest = () => {
    Notification.requestPermission().then((result) => {
      setPermission(result as NotificationPermission);
    });
  };

  return (
    <div className={classNames("w-full space-y-4", className)}>
      {/* Show native app installation if not in native WebView */}
      {!isNativeWebView() && !isStandaloneMode && <NativeAppInstallation />}

      {/* Show appropriate notification status based on environment */}
      {isNativeWebView() ? (
        <WebViewNotificationStatus
          status={expoStatus}
          onRequestPermission={handleWebViewPermissionRequest}
        />
      ) : isStandaloneMode ? (
        <WebPWANotificationStatus
          permission={permission}
          onRequestPermission={handleWebPermissionRequest}
        />
      ) : (
        <PWAInstall />
      )}
    </div>
  );
};
