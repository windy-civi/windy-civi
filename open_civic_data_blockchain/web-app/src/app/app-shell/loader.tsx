import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getPreferencesFromCookies } from "../preferences/api";
import { AppShellLoaderData, FeedNavItem } from "./types";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { LocaleMap, SupportedLocale } from "@windy-civi/domain/locales";
import { slugify } from "@windy-civi/domain/scalars";

const createAvailableFeeds = (preferences: UserPreferences): FeedNavItem[] => {
  const feeds: FeedNavItem[] = [];
  // If default preferences, show trending USA as default.
  if (
    preferences.location === SupportedLocale.USA &&
    !preferences.tags.length
  ) {
    return [
      {
        href: "/",
        name: "USA Trending",
      },
    ];
  }

  feeds.push({
    href: "/",
    name: "For You",
  });

  LocaleMap[preferences.location].forEach((locale) => {
    feeds.push({
      href: `/${locale}`,
      name: locale,
    });
  });

  preferences.tags.forEach((tag) => {
    feeds.push({
      href: `/${slugify(tag)}`,
      name: tag,
    });
  });

  return feeds;
};

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);

  const preferences = await getPreferencesFromCookies(document.cookie);

  const availableFeeds = createAvailableFeeds(preferences);

  return json<AppShellLoaderData>({
    env,
    preferences,
    availableFeeds,
  });
};
