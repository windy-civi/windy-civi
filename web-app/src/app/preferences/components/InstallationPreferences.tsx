import { classNames } from "../../design-system/styles";
import { StatusMessage } from "../../design-system";
import { PWAInstall } from "./PwaInstaller";
import AppleAppStoreIcon from "./assets/apple-app-store.svg";
import GooglePlayIcon from "./assets/google-play.svg";

// Environment detection
const isPWAInstalled = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
};

const isInsideNativeApp = () => {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /wv/.test(userAgent) || /webview/.test(userAgent);
};

interface InstallationPreferencesProps {
  className?: string;
}

// Native App Installation Options
const InstallationBadges = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-white">
        <p>To get push notifications, install the iOS, Android or Web App.</p>
        <div className="mt-2 flex flex-row gap-2 items-center justify-center w-full h-full">
          <div className="flex">
            <PWAInstall />
          </div>
          <div className="flex">
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
          </div>
          <div className="flex">
            <a
              href="#"
              className="inline-block cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              <div className="relative group">
                <img
                  src={GooglePlayIcon}
                  alt="Get it on Google Play"
                  className="h-10"
                />
                <div className="absolute z-20 inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <span className="text-white font-medium">Coming Soon</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstallationPreferences: React.FC<
  InstallationPreferencesProps
> = ({ className }) => {
  const pwaInstalled = isPWAInstalled();
  const insideNativeApp = isInsideNativeApp();
  return (
    <div className={classNames("w-full space-y-4", className)}>
      {/* Show success message if installed as PWA */}
      {pwaInstalled && (
        <StatusMessage
          type="success"
          message="✓ Windy Civi Web App is installed on your device"
        />
      )}

      {/* Show success message if installed as native app */}
      {insideNativeApp && (
        <StatusMessage
          type="success"
          message="✓ Windy Civi Native App is installed on your device"
        />
      )}

      {/* Show native app installation if not in native view or installed as PWA */}
      {!insideNativeApp && !pwaInstalled && <InstallationBadges />}
    </div>
  );
};
