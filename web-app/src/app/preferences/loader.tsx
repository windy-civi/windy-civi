import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { parseAvailableTags } from "@windy-civi/domain/filters/filters.utils";
import { getRepresentativesWithCache } from "@windy-civi/domain/representatives/representatives.api";
import { getAllOffices } from "@windy-civi/domain/representatives/representatives.utils";
import { UserPreferencesLoaderData } from "./types";
import { getPreferencesFromCookies } from "./api";

// Preferences

// History

// Saved Feed Sources

// Other Saved Data
// -- Available Tags
// -- Representatives

export const loader: LoaderFunction = async () => {
  // Env comes from vite
  const env = getEnv(import.meta.env);

  // Preferences are in cookies
  const preferences = await getPreferencesFromCookies(document.cookie);

  // Saved data, like feed sources, representatives, and available tags are in a local localStorage.
  // Todo: move this to getting from IndexedDB
  const representatives = await getRepresentativesWithCache(
    env,
    preferences.location,
  );
  const offices = getAllOffices(representatives);
  const availableTags = parseAvailableTags(preferences.location);

  return json<UserPreferencesLoaderData>({
    env,
    data: {
      offices,
      availableTags,
    },
    preferences,
  });
};
