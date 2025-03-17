import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getPreferencesFromCookies } from "../preferences/api";
import { AppShellLoaderData } from "./types";

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);

  const preferences = await getPreferencesFromCookies(document.cookie);

  return json<AppShellLoaderData>({
    env,
    preferences,
    availableFeeds: [],
  });
};
