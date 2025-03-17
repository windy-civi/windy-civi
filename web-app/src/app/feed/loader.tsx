import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getFilteredLegislation } from "@windy-civi/domain/filters/filters.api";

import { viteDataGetter } from "../../api/vite-api";
import { getRepresentativesWithCache } from "@windy-civi/domain/representatives/representatives.api";
import { getPreferencesFromCookies } from "../preferences/api";
import { type FeedLoaderData } from "./types";

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);
  const userPreferences = await getPreferencesFromCookies(document.cookie);

  const representatives = await getRepresentativesWithCache(
    env,
    userPreferences.location,
  );
  const feedData = await getFilteredLegislation({
    representatives,
    filters: userPreferences,
    dataStoreGetter: viteDataGetter,
  });

  return json<FeedLoaderData>({
    env,
    userPreferences,
    feedData: feedData.filteredLegislation,
  });
};
