import { Env, UserPreferences } from "@windy-civi/domain/types";

export interface AppShellLoaderData {
  env: Env;
  availableFeeds: string[];
  preferences: UserPreferences;
  // lastVisited: string; // timestamp
  // current
}
