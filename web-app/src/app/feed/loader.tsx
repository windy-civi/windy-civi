import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getFeed } from "@windy-civi/domain/feed";

import { viteDataGetter } from "../../api/vite-api";
import { getPreferencesFromCookies } from "../preferences/api";
import { type FeedLoaderData } from "./types";

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);
  const preferences = await getPreferencesFromCookies(document.cookie);

  const feedData = await getFeed({
    preferences,
    dataStoreGetter: viteDataGetter,
  });

  return json<FeedLoaderData>({
    env,
    preferences,
    feed: feedData.feed,
  });
};
