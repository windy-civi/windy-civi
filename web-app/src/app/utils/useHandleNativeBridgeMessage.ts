import { useCallback } from "react";
import {
  NATIVE_BRIDGE_ERROR,
  SEND_NATIVE_NOTIFICATION_STATUS,
  parseEvent,
} from "@windy-civi/domain/native-web-bridge/native-web-bridge";

type NativeBridgeMessageHandler = (event: MessageEvent) => void;

export const useHandleNativeBridgeMessage = (
  onNotificationStatusUpdate?: (status: string) => void,
  onError?: (error: Error) => void,
) => {
  const handleNativeBridgeMessage = useCallback<NativeBridgeMessageHandler>(
    (event: MessageEvent) => {
      const parsedEvent = parseEvent(event.data);
      if (!parsedEvent) {
        return;
      }

      switch (parsedEvent.type) {
        case SEND_NATIVE_NOTIFICATION_STATUS:
          onNotificationStatusUpdate?.(parsedEvent.payload);
          break;
        case NATIVE_BRIDGE_ERROR:
          onError?.(parsedEvent.payload);
          break;
        default:
          break;
      }
    },
    [onNotificationStatusUpdate, onError],
  );

  return { handleNativeBridgeMessage };
};
