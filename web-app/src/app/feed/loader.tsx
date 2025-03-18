import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getFeed } from "@windy-civi/domain/feed";

import { viteDataGetter } from "../../api/vite-api";
import { getPreferencesFromCookies } from "../preferences/api";
import { type FeedLoaderData } from "./types";

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);
  const userPreferences = await getPreferencesFromCookies(document.cookie);

  const feedData = await getFeed({
    preferences: userPreferences,
    dataStoreGetter: viteDataGetter,
  });

  return json<FeedLoaderData>({
    env,
    userPreferences,
    feed: feedData.feed,
  });
};
