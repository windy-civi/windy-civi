export const SyncPushState = "SyncPushState";

export type Events = {
  type: typeof SyncPushState;
  payload: "granted" | "denied" | "prompt";
};
