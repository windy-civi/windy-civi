import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getPreferencesFromCookies } from "../preferences/utils";
import { NavigatorLoaderData } from "./types";

export const loader: LoaderFunction = async () => {
  const env = getEnv(import.meta.env);

  const preferences = await getPreferencesFromCookies(document.cookie);

  return json<NavigatorLoaderData>({
    env,
    preferences,
    availableFeeds: [],
  });
};
