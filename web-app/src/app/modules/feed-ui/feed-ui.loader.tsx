import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "~app/modules/config";

import { getFilteredLegislation } from "@windycivi/domain/filters/filters.api";

import { DEFAULT_FILTERS } from "@windycivi/domain/constants";
import {
  createFilterParams,
  parseRepLevel,
} from "@windycivi/domain/filters/filters.utils";
import { FilterParams } from "@windycivi/domain/types";
import { viteDataGetter } from "../../../api/vite-api";
import { DEFAULT_GLOBAL_STATE, RouteOption } from "./feed-ui.constants";
import { type FeedLoaderData } from "./feed-ui.types";
import { getCookieFromString } from "./feed-ui.utils";
import { getRepresentativesWithCache } from "@windycivi/domain/representatives/representatives.api";
import { getAllOffices } from "@windycivi/domain/representatives/representatives.utils";

export const loader: LoaderFunction = async ({ request }) => {
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

    const hideLLMWarning = getCookieFromString(cookieHeader, "hideLLMWarning");
    if (hideLLMWarning) {
      globalState.hideLLMWarning = true;
    }
  }

  // Explore State is in the URL Search Params
  const url = new URL(request.url);

  const showExplore = url.searchParams.get("showExplore");

  if (!savedPreferences) {
    globalState.route = RouteOption.INTRO;
  } else if (savedPreferences && showExplore) {
    globalState.route = RouteOption.EXPLORE;
  } else {
    globalState.route = RouteOption.FEED;
  }

  const shouldAcceptSearchParams =
    globalState.route === RouteOption.EXPLORE ||
    globalState.route === RouteOption.INTRO;

  const levelSearchParam = url.searchParams.get("level");
  const locationSearchParam = url.searchParams.get("location");

  let searchParams: FilterParams | null = null;
  if (shouldAcceptSearchParams) {
    const tags = url.searchParams.get("tags");
    const level = levelSearchParam;
    searchParams = createFilterParams({
      location: locationSearchParam,
      level,
      tags,
    });
  }

  // The one search param used on the feed is level
  if (savedPreferences && levelSearchParam) {
    savedPreferences = {
      ...savedPreferences,
      level: parseRepLevel(levelSearchParam),
    };
  }

  // Picking filters based on if feed or explore
  const filters: FilterParams =
    shouldAcceptSearchParams && searchParams
      ? searchParams
      : savedPreferences
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
