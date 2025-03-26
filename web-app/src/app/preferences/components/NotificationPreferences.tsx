import { useEffect, useState } from "react";
import { classNames } from "../../design-system/styles";
import { StatusMessage } from "../../design-system";
import {
  INITIALIZE_NATIVE_NOTIFICATIONS,
  GET_NATIVE_NOTIFICATION_STATUS,
  PermissionStatus,
} from "@windy-civi/domain/native-web-bridge/native-web-bridge";
import { useHandleNativeBridgeMessage } from "../../utils/useHandleNativeBridgeMessage";

const isNativeWebView = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /wv/.test(userAgent) || /webview/.test(userAgent);
};

interface NotificationPreferencesProps {
  className?: string;
}

// WebView Notification Status
const WebViewNotificationStatus = ({
  status,
  onRequestPermission,
}: {
  status: PermissionStatus | null;
  onRequestPermission: () => void;
}) => {
  switch (status) {
    case PermissionStatus.DENIED:
      return (
        <StatusMessage
          type="error"
          message="Notifications are blocked. Please enable them in your device settings."
        />
      );
    case PermissionStatus.GRANTED:
      return (
        <StatusMessage
          type="success"
          message="✓ Notifications are enabled! You'll receive updates about legislation you care about."
        />
      );
    case PermissionStatus.UNDETERMINED:
    default:
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
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const { handleNativeBridgeMessage } = useHandleNativeBridgeMessage(
    (status) => {
      setStatus(status as PermissionStatus);
    },
    (error) => {
      console.error("Native notification error:", error);
      setStatus(PermissionStatus.DENIED);
    },
  );

  useEffect(() => {
    // Check notification permissions
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
    }

    // Set up message listener for native bridge
    window.addEventListener("message", handleNativeBridgeMessage);
    return () =>
      window.removeEventListener("message", handleNativeBridgeMessage);
  }, [handleNativeBridgeMessage]);

  useEffect(() => {
    // Request native notification status when in WebView
    if (isNativeWebView()) {
      if ("ReactNativeWebView" in window) {
        // @ts-expect-error no types for react native webview
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: GET_NATIVE_NOTIFICATION_STATUS,
            payload: true,
          }),
        );
      }
    }
  }, []);

  const handleWebViewPermissionRequest = () => {
    if ("ReactNativeWebView" in window) {
      // @ts-expect-error no types for react native webview
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: INITIALIZE_NATIVE_NOTIFICATIONS,
          payload: true,
        }),
      );
    }
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
          status={status}
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
