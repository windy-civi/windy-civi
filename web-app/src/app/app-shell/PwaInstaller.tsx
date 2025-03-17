// TODO: Ideally should just use a 3rd party library for this
// but was having trouble with installing on Remix

import { CSSProperties, useEffect, useState } from "react";
import { StyleHack, ZIndex, classNames } from "../design-system";
import { ShareIOS } from "../design-system/Icons";
import { cookieFactory } from "../utils/cookies";

// iOS Safari
const isIos = (window: Window) => {
  if (!window) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isChrome = (window: Window) => {
  if (!window) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /chrome/.test(userAgent) && !/edg/.test(userAgent); // Ensure it's not Edge
};

const isAndroid = (window: Window) => {
  if (!window) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
};

export interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}

type CanInstallCallback = (
  canInstall: boolean,
  install?: () => Promise<boolean>,
) => void;

class PwaInstallHandler {
  private event: BeforeInstallPromptEvent | null = null;
  private callbacks: CanInstallCallback[] = [];

  constructor() {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.updateEvent(event as BeforeInstallPromptEvent);
    });

    window.addEventListener("appinstalled", () => {
      this.updateEvent(null);
    });
  }

  /**
   * Triggers install prompt.
   */
  public install = async (): Promise<boolean> => {
    if (this.event) {
      this.event.prompt();
      return await this.event.userChoice.then(({ outcome }) => {
        this.updateEvent(null);
        return outcome === "accepted" || true;
      });
    } else {
      throw new Error("Not allowed to prompt.");
    }
  };

  /**
   * Returns internal `BeforeInstallPromptEvent`.
   */
  public getEvent() {
    return this.event;
  }

  /**
   * Tells whether the app is ready to be installed.
   */
  public canInstall() {
    return this.event !== null;
  }

  private updateEvent(event: BeforeInstallPromptEvent | null) {
    if (event === this.event) {
      return;
    }
    this.event = event;
    this.callbacks.forEach((callback) => callback(this.canInstall()));
  }

  /**
   * Adds listener with a callback which is called when install state changes.
   */
  public addListener(callback: CanInstallCallback): void {
    callback(this.canInstall());
    this.callbacks.push(callback);
  }

  /**
   * Removes listener.
   */
  public removeListener(callback: CanInstallCallback): void {
    this.callbacks = this.callbacks.filter(
      (otherCallback) => callback !== otherCallback,
    );
  }
}

interface PwaInstallPromptProps {
  showModal: boolean;
  onClose: () => void;
  onInstall: () => void;
}

const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  showModal,
  onClose,
  onInstall,
}) => {
  if (!showModal) return null;

  const mobileStyle: CSSProperties = {
    position: "fixed",
    bottom: "0px",
    width: "100%",
    zIndex: ZIndex["z-index-4"],
  };

  const desktopStyle: CSSProperties = {
    width: "100%",
  };

  const close = (
    <button className="text-white opacity-60" onClick={onClose}>
      x
    </button>
  );

  if (isIos(window)) {
    return (
      <div style={mobileStyle}>
        <div
          className="bg-black bg-opacity-80 p-6 text-white backdrop-blur-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.4) 0px -7px 10px" }}
        >
          <div className="mb-2 flex items-start text-sm">
            <div>
              Add App To Home Screen To Stay Up To Date With Legislation.
            </div>
            {close}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="" style={{ width: "30px" }}>
                <ShareIOS />
              </div>
              <div>Press share in navigation bar</div>
            </div>

            <div className="flex items-center justify-start">
              <div>
                <div
                  className="flex items-center justify-center rounded border-2  border-solid border-white px-1 font-bold text-white"
                  style={{
                    width: "23px",
                    height: "23px",
                    marginLeft: "4px" as StyleHack,
                  }}
                >
                  +
                </div>
              </div>
              <div className="pl-2">Press Add to Home Screen</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isChrome(window)) {
    const android = isAndroid(window);
    return (
      <div style={isAndroid(window) ? mobileStyle : desktopStyle}>
        <div
          className={classNames(
            "flex items-center justify-center gap-3 bg-black bg-opacity-60 text-white opacity-90 shadow-lg backdrop-blur-2xl",
            android ? "p-4" : "p-1",
          )}
        >
          <div className="text-sm opacity-70">
            Add Windy Civi To Your Desktop To Stay Up To Date With Legislation.
          </div>
          <button
            className="my-1 mr-2 rounded bg-green-500 bg-opacity-50 px-2 text-white opacity-90"
            onClick={onInstall}
          >
            Install
          </button>
          <div className="py-1">{close}</div>
        </div>
      </div>
    );
  }
  return <></>;
};

const pwaInstallHandler = new PwaInstallHandler();

export const PWAInstallClient = () => {
  const cookies = cookieFactory(document);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    pwaInstallHandler.addListener((canInstall) => {
      const shouldDismiss = cookies.get("dismiss-pwa-install-prompt");
      if (canInstall && !shouldDismiss) {
        setShowPrompt(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    const cookies = cookieFactory(document);
    cookies.set("dismiss-pwa-install-prompt", "true", 30);
    setShowPrompt(false);
  };

  const onInstall = async () => {
    pwaInstallHandler.install();
  };

  return (
    <PwaInstallPrompt
      showModal={showPrompt}
      onClose={onClose}
      onInstall={onInstall}
    />
  );
};

export const ClientOnly = (props: { children: () => JSX.Element }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (window.document) {
      setIsClient(true);
    }
  }, []);

  if (isClient) {
    return props.children();
  } else {
    return <></>;
  }
};

export const PWAInstall = () => (
  <ClientOnly>{() => <PWAInstallClient />}</ClientOnly>
);
