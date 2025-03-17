import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { parseAvailableTags } from "@windy-civi/domain/feed/utils";
import { UserPreferencesLoaderData } from "./types";
import { getPreferencesFromCookies } from "./api";

// Preferences

// History

// Saved Feed Sources

// Other Saved Data
// -- Available Tags

export const loader: LoaderFunction = async () => {
  // Env comes from vite
  const env = getEnv(import.meta.env);

  // Preferences are in cookies
  const preferences = await getPreferencesFromCookies(document.cookie);

  const availableTags = parseAvailableTags(preferences.location);

  return json<UserPreferencesLoaderData>({
    env,
    data: {
      availableTags,
    },
    preferences,
  });
};
