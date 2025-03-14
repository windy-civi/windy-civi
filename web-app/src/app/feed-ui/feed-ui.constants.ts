import { GlobalState } from "./feed-ui.types";

export enum RouteOption {
  FEED = "FEED",
}

export const DEFAULT_GLOBAL_STATE: GlobalState = {
  lastVisited: "",
  route: RouteOption.FEED,
};
