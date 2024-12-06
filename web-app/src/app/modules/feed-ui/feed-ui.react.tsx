import { useLoaderData, useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Feed } from "~app/modules/feed-ui";
import { DEFAULT_GLOBAL_STATE, RouteOption } from "./feed-ui.constants";
import {
  type FeedProps,
  type UpdateFiltersFn,
  type UpdateGlobalStateFn,
} from "./feed-ui.types";
import { cookieFactory, formatDate } from "./feed-ui.utils";
import { DEFAULT_FILTERS } from "@windy-civi/domain/constants";
import {
  getLocation,
  hasTags,
  stringifyTags,
  createFilterParams,
} from "@windy-civi/domain/filters/filters.utils";
import { FilterParams } from "@windy-civi/domain/types";
import { publishUserPreferences } from "../../../native-web-bridge";

export function ForYouPage() {
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

    // maybe send userPreferences to native app
    publishUserPreferences({
      legislators: [],
      issues: [],
    });
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

    // maybe send userPreferences to native app
    publishUserPreferences({
      legislators: [],
      issues: [],
    });

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
