import { Env } from "@windy-civi/domain/drivers";
import { UserPreferences } from "@windy-civi/domain/user-preferences";

export interface FeedNavItem {
  href: string;
  name: string; // key for the feed.
}

export interface AppShellLoaderData {
  env: Env;
  availableFeeds: FeedNavItem[];
  preferences: UserPreferences;
  // lastVisited: string; // timestamp
  // current
}
