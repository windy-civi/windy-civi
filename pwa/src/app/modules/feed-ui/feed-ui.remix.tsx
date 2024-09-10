import {
  json,
  useLoaderData,
  useSearchParams,
  type LoaderFunction,
} from "react-router-dom";
import { getEnv } from "~app/modules/config";

import { useEffect, useState } from "react";
import { getFilteredLegislation } from "~app/modules/data/api";
import type { FilterParams } from "~app/modules/data/filters";
import {
  DEFAULT_FILTERS,
  createFilterParams,
  getLocation,
  hasTags,
  parseRepLevel,
  stringifyTags,
} from "~app/modules/data/filters";
import { Feed } from "~app/modules/feed-ui";
import { DEFAULT_GLOBAL_STATE, RouteOption } from "./feed-ui.constants";
import {
  type FeedLoaderData,
  type FeedProps,
  type UpdateFiltersFn,
  type UpdateGlobalStateFn,
} from "./feed-ui.types";
import {
  cookieFactory,
  formatDate,
  getCookieFromString,
} from "./feed-ui.utils";

export const loader: LoaderFunction = async ({ request }) => {
  const globalState = DEFAULT_GLOBAL_STATE;

  // Feed State is in Cookies
  const cookieHeader = request.headers.get("Cookie");
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

  const filteredLegislation = await getFilteredLegislation({
    env,
    filters,
  });

  return json<FeedLoaderData>({
    env,
    filters,
    globalState,
    ...filteredLegislation,
  });
};

export default function ForYouPage() {
  const result = useLoaderData() as FeedProps;
  const [searchParams, setSearchParams] = useSearchParams();

  const [globalState, setGlobalState] = useState(result.globalState);
  const [filters, setFilters] = useState(result.filters);

  // Update the last updated timestamp
  useEffect(() => {
    // Ignore on intro
    if (globalState.route === RouteOption.INTRO) {
      return;
    }
    const cookies = cookieFactory(document);
    const today = formatDate();
    const previousDate = cookies.get("lastVisited");
    const holdDate = cookies.get("lastVisitedHold");
    if (previousDate !== today) {
      cookies.set("lastVisitHold", previousDate, 0.5);
      cookies.set("lastVisited", today);
      setGlobalState({ ...globalState, lastVisited: previousDate });
    }
    // If hold date exists, use it for global state
    if (holdDate) {
      setGlobalState({ ...globalState, lastVisited: holdDate });
    }
    // Only want this to run once
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const updateFilters: UpdateFiltersFn = (next) => {
    // Decide which storage to use
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // Update Filters
    if ("location" in next) {
      // Always delete level to reset
      newSearchParams.delete("level");

      const locationString = getLocation(next.location);
      if (!locationString) {
        newSearchParams.delete("location");
      } else {
        newSearchParams.set("location", locationString);
      }
    } else if ("level" in next) {
      next.level
        ? newSearchParams.set("level", next.level)
        : newSearchParams.delete("level");
    }

    if ("tags" in next) {
      hasTags(next.tags)
        ? newSearchParams.set("tags", stringifyTags(next.tags))
        : newSearchParams.delete("tags");
    }

    setFilters({ ...filters, ...next });
    setSearchParams(newSearchParams);
  };

  const saveToFeed: FeedProps["saveToFeed"] = (next) => {
    const cookies = cookieFactory(document);
    Object.keys(next).forEach((k) => {
      const key = k as keyof FilterParams;
      let value = next[key] ? String(next[key]) : null;
      if (key === "location") {
        value = getLocation(next[key] as FilterParams["location"]);
      }
      if (value) {
        cookies.set(key, value);
      } else {
        cookies.delete(key);
      }
    });
    setFilters({ ...filters, ...next });
    // Reset URL Search Params
    setSearchParams(new URLSearchParams());
  };

  const deleteAllData = () => {
    const cookies = cookieFactory(document);
    cookies.delete("location");
    cookies.delete("tags");
    cookies.delete("level");
    cookies.delete("lastVisited");
    cookies.delete("lastVisitHold");
    cookies.delete("hideLLMWarning");
    cookies.delete("pwa-install-prompt");
    setFilters(DEFAULT_FILTERS);
    setGlobalState(DEFAULT_GLOBAL_STATE);
    setSearchParams(new URLSearchParams());
  };

  const updateGlobalState: UpdateGlobalStateFn = (next) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const cookies = cookieFactory(document);
    if ("route" in next) {
      // Get default filter data from your feed
      if (next.route === RouteOption.EXPLORE) {
        newSearchParams.set("showExplore", "true");
      } else {
        newSearchParams.delete("showExplore");
      }

      // Go through the filters and add/remove them based on the mode
      ["location", "tags", "level"].forEach((filterParam) => {
        if (next.route === RouteOption.EXPLORE) {
          const savedParam = cookies.get(filterParam);
          if (savedParam) {
            newSearchParams.set(filterParam, savedParam);
          }
        } else {
          newSearchParams.delete(filterParam);
        }
      });

      if (next.route === RouteOption.FEED) {
        const savedPreferences = createFilterParams({
          location: cookies.get("location"),
          level: cookies.get("level"),
          tags: cookies.get("tags"),
        });
        setFilters({ ...filters, ...savedPreferences });

        newSearchParams.delete("showExplore");
      }
    }

    if ("hideLLMWarning" in next) {
      cookies.set("hideLLMWarning", "true");
    }

    setSearchParams(newSearchParams);
    setGlobalState({ ...globalState, ...next });
  };

  return (
    <Feed
      {...result}
      filters={filters}
      globalState={globalState}
      updateGlobalState={updateGlobalState}
      updateFilters={updateFilters}
      saveToFeed={saveToFeed}
      deleteAllData={deleteAllData}
    />
  );
}
