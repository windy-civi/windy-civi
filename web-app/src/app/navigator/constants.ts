import { GlobalState } from "./types";

export enum RouteOption {
  FEED = "FEED",
}

export const DEFAULT_GLOBAL_STATE: GlobalState = {
  lastVisited: "",
  route: RouteOption.FEED,
};
