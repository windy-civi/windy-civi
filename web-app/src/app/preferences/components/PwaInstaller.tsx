// TODO: Ideally should just use a 3rd party library for this

import { useEffect, useState } from "react";
import { StyleHack } from "../../design-system/styles";

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
  // onClose: () => void;
  onInstall: () => void;
}

const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  showModal,
  // onClose,
  onInstall,
}) => {
  if (!showModal) return null;

  return (
    <div>
      <button
        className="rounded-md bg-black hover:bg-opacity-80 text-white opacity-90 border border-white border-opacity-70"
        style={{ padding: "4px 10px 2px 10px" as StyleHack }}
        onClick={onInstall}
      >
        <div className="flex items-center gap-2">
          <div className="text-2xl">↓</div>
          <div className="flex flex-col justify-center items-start">
            <div
              className="uppercase"
              style={{ fontSize: "8px", lineHeight: "9px" }}
            >
              Download as
            </div>
            <div style={{ fontSize: "14px", lineHeight: "16px" }}>Web App</div>
          </div>
        </div>
      </button>
    </div>
  );
};

const pwaInstallHandler = new PwaInstallHandler();

export const PWAInstall = () => {
  // const cookies = cookieFactory(document);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    pwaInstallHandler.addListener((canInstall) => {
      // const shouldDismiss = cookies.get("dismiss-pwa-install-prompt");
      if (canInstall) {
        setShowPrompt(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const onClose = () => {
  //   // const cookies = cookieFactory(document);
  //   // cookies.set("dismiss-pwa-install-prompt", "true", 30);
  //   setShowPrompt(false);
  // };

  const onInstall = async () => {
    pwaInstallHandler.install();
  };

  return (
    <PwaInstallPrompt
      showModal={showPrompt}
      // onClose={onClose}
      onInstall={onInstall}
    />
  );
};
