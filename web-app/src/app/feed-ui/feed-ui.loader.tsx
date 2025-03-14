import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getFilteredLegislation } from "@windy-civi/domain/filters/filters.api";

import { DEFAULT_FILTERS } from "@windy-civi/domain/constants";
import { createFilterParams } from "@windy-civi/domain/filters/filters.utils";
import { FilterParams } from "@windy-civi/domain/types";
import { viteDataGetter } from "../../api/vite-api";
import { DEFAULT_GLOBAL_STATE, RouteOption } from "./feed-ui.constants";
import { type FeedLoaderData } from "./feed-ui.types";
import { getCookieFromString } from "./feed-ui.utils";
import { getRepresentativesWithCache } from "@windy-civi/domain/representatives/representatives.api";
import { getAllOffices } from "@windy-civi/domain/representatives/representatives.utils";

export const loader: LoaderFunction = async () => {
  const globalState = DEFAULT_GLOBAL_STATE;

  // Feed State is in Cookies
  const cookieHeader = document.cookie;
  let savedPreferences: FilterParams | null = null;

  if (cookieHeader) {
    const location = getCookieFromString(cookieHeader, "location");
    const level = getCookieFromString(cookieHeader, "level");
    const tags = getCookieFromString(cookieHeader, "tags");

    if (location) {
      savedPreferences = createFilterParams({
        location,
        level,
        tags,
      });
    }

    // Global State
    // We have a temp hold state that we leverage for actual rendering, while
    // the long running cookie lastVisited can be used to check actual history.
    const lastVisitHold = getCookieFromString(cookieHeader, "lastVisitHold");
    const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
    globalState.lastVisited = lastVisitHold || lastVisited || "";
  }

  // todo: update later
  globalState.route = RouteOption.FEED;

  // Picking filters based on if feed or explore
  const filters: FilterParams = savedPreferences
    ? savedPreferences
    : DEFAULT_FILTERS;

  const env = getEnv(import.meta.env);
  const representatives = await getRepresentativesWithCache(
    env,
    filters.location,
  );
  const filteredLegislation = await getFilteredLegislation({
    representatives,
    filters,
    dataStoreGetter: viteDataGetter,
  });

  const offices = getAllOffices(representatives);

  return json<FeedLoaderData>({
    env,
    filters,
    globalState,
    offices,
    ...filteredLegislation,
  });
};
