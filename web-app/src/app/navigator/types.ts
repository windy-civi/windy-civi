import { Env, UserPreferences } from "@windy-civi/domain/types";

export interface NavigatorLoaderData {
  env: Env;
  availableFeeds: string[];
  preferences: UserPreferences;
  // lastVisited: string; // timestamp
  // current
}
