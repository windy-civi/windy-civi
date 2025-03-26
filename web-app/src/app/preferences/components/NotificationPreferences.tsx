import { useEffect, useState } from "react";
import { classNames } from "../../design-system/styles";
import { StatusMessage } from "../../design-system";

const isNativeWebView = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /wv/.test(userAgent) || /webview/.test(userAgent);
};

// Notification permission states
type NotificationPermission = "default" | "granted" | "denied";

type ExpoNotificationStatus =
  | "not-determined"
  | "denied"
  | "authorized"
  | "provisional"
  | "ephemeral";

interface NotificationPreferencesProps {
  className?: string;
}

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
        <div className="text-sm text-white">
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
        <StatusMessage
          type="error"
          message="Notifications are blocked. Please enable them in your device settings."
        />
      );
    case "authorized":
    case "provisional":
    case "ephemeral":
      return (
        <StatusMessage
          type="success"
          message="✓ Notifications are enabled! You'll receive updates about legislation you care about."
        />
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
        <StatusMessage
          type="success"
          message="✓ Notifications are enabled! You'll receive updates about legislation you care about."
        />
      );
    case "denied":
      return (
        <StatusMessage
          type="error"
          message="Notifications are blocked. Please enable them in your browser settings."
        />
      );
    case "default":
      return (
        <div className="text-sm text-white">
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
    useState<NotificationPermission>("default");
  const [expoStatus, setExpoStatus] = useState<ExpoNotificationStatus | null>(
    null,
  );

  useEffect(() => {
    // Check notification permissions
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
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
      {/* Show appropriate notification status based on environment */}
      {isNativeWebView() && (
        <WebViewNotificationStatus
          status={expoStatus}
          onRequestPermission={handleWebViewPermissionRequest}
        />
      )}

      {/* WebPWANotificationStatus shows for both standalone and web */}
      {!isNativeWebView() && (
        <WebPWANotificationStatus
          permission={permission}
          onRequestPermission={handleWebPermissionRequest}
        />
      )}
    </div>
  );
};
