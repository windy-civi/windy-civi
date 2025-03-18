import { json, type LoaderFunction } from "react-router-dom";
import { getEnv } from "../config";

import { getFeed } from "@windy-civi/domain/feed";

import { viteDataGetter } from "../../api/vite-api";
import { getPreferencesFromCookies } from "../preferences/api";
import { type FeedLoaderData } from "./types";
import { deslugify } from "@windy-civi/domain/scalars";
import { isSupportedTag } from "@windy-civi/domain/tags";
import { isSupportedLocale } from "@windy-civi/domain/locales";
import { WindyCiviBill } from "@windy-civi/domain/legislation";

export const loader: LoaderFunction = async ({ params }) => {
  const env = getEnv(import.meta.env);
  const preferences = await getPreferencesFromCookies(document.cookie);

  // Get the route parameter 'id' from params
  const maybeTag = deslugify(params.feedId || "");

  let filterBy: (bill: WindyCiviBill) => boolean = () => true;

  if (isSupportedTag(maybeTag)) {
    filterBy = (bill) => bill.allTags.includes(maybeTag);
  }

  if (isSupportedLocale(params.feedId)) {
    filterBy = (bill) => bill.locale === params.feedId;
  }

  const feedData = await getFeed({
    preferences,
    dataStoreGetter: viteDataGetter,
    filterBy,
  });

  return json<FeedLoaderData>({
    env,
    preferences,
    feed: feedData.feed,
  });
};
