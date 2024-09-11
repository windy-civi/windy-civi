import { GlobalState } from "./feed-ui.types";

export enum RouteOption {
  FEED = "FEED",
  EXPLORE = "EXPLORE",
  INTRO = "INTRO",
}

export const DEFAULT_GLOBAL_STATE: GlobalState = {
  lastVisited: "",
  route: RouteOption.INTRO,
  hideLLMWarning: false,
};
