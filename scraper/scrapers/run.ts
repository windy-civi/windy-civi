import { CiviLegislationData } from "@windy-civi/domain";
import { forEachLocale } from "@windy-civi/domain/filters/filters.utils";
import { findDifferences } from "@windy-civi/domain/legislation-diff/diff";
import { storage } from "@windy-civi/storage";
import path from "path";
import { getLocale, getShouldSkipCache } from "../config/env";

import { Locales } from "@windy-civi/domain/types";
import * as il from "./localities/illinois.legiscan";
import * as usa from "./localities/usa.legiscan";
import { councilmatic } from "./sources/councilmatic";

export const api: Record<
  Locales,
  (p: {
    skipCache: boolean;
    cacheDir: string;
  }) => Promise<CiviLegislationData[]>
> = {
  chicago: councilmatic.getChicagoBills,
  illinois: il.getBills,
  usa: usa.getBills,
};

const cacheDir = path.join(__dirname, "dist_legislation");

const scrapeLegislation = async () => {
  const skipCache = getShouldSkipCache();
  const localeFromEnv = getLocale();

  forEachLocale(async (locale) => {
    console.info("scraping for locale:", locale);
    const legislation = await api[locale]({ skipCache, cacheDir });
    console.info("getting changes in legislation");
    // Get the data from Github Pages that hasn't been changed yet.
    const oldLegislation = await storage.github.getLegislation(locale);
    const changes = findDifferences(oldLegislation, legislation);
    console.info("writing changes file");
    storage.fs.saveChanges(locale, cacheDir, changes);
    console.info("writing locale file");
    storage.fs.saveLegislation(locale, cacheDir, legislation);
  }, localeFromEnv);
};

scrapeLegislation();
