import { useEffect, useState } from "react";
import { classNames } from "../../design-system/styles";
import { StatusMessage } from "../../design-system";
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

interface InstallationPreferencesProps {
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

export const InstallationPreferences: React.FC<
  InstallationPreferencesProps
> = ({ className }) => {
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);

  useEffect(() => {
    // Check if we're in standalone mode
    setIsStandaloneMode(isStandalone());
  }, []);

  return (
    <div className={classNames("w-full space-y-4", className)}>
      {/* Show success message if installed as PWA */}
      {isStandaloneMode && (
        <StatusMessage
          type="success"
          message="✓ Windy Civi Web App is installed on your device"
        />
      )}

      {/* Show success message if installed as native app */}
      {isNativeWebView() && (
        <StatusMessage
          type="success"
          message="✓ Windy Civi Native App is installed on your device"
        />
      )}

      {/* Show native app installation if not in native view or installed as PWA */}
      {!isNativeWebView() && !isStandaloneMode && <NativeAppInstallation />}

      {/* PWAInstall is only shown in web browser mode */}
      {!isNativeWebView() && !isStandaloneMode && <PWAInstall />}
    </div>
  );
};
