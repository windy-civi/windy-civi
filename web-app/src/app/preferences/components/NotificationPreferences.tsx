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

const NotificationToggle = ({
  isEnabled,
  onClick,
}: {
  isEnabled: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg ${
      isEnabled
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-gray-200 hover:bg-gray-300"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        isEnabled ? "translate-x-8" : "translate-x-0"
      }`}
    />
  </button>
);

const NotificationContainer = ({
  children,
  toggle,
}: {
  children: React.ReactNode;
  toggle?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between w-full">
    {children}
    {toggle}
  </div>
);

// Web PWA Notification Status
const WebPWANotificationStatus = ({
  permission,
  onRequestPermission,
}: {
  permission: NotificationPermission;
  onRequestPermission: () => void;
}) => {
  const isEnabled = permission === "granted";
  const toggle = (
    <NotificationToggle isEnabled={isEnabled} onClick={onRequestPermission} />
  );

  switch (permission) {
    case "granted":
      return (
        <NotificationContainer>
          <StatusMessage
            type="success"
            message="✓ Notifications are enabled! You'll receive updates about legislation you care about."
          />
        </NotificationContainer>
      );
    case "denied":
      return (
        <NotificationContainer>
          <StatusMessage
            type="error"
            message="Notifications are blocked. Please enable them in your browser settings."
          />
        </NotificationContainer>
      );
    case "default":
      return (
        <NotificationContainer toggle={toggle}>
          <div className="text-sm text-white">
            Enable notifications to get updates about legislation you care
            about.
          </div>
        </NotificationContainer>
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
