import { CiviLegislationData } from "../../domain";
import { SupportedLocale } from "../../domain/constants";
import { forEachLocale } from "../../domain/filters/filters.utils";
import { findDifferences } from "../../domain/legislation-diff/diff";
import { getGHDeployedLegislation } from "../cache-grabber/get";
import { getLocale, getShouldSkipCache } from "../config/env";
import { writeChangesJSON, writeLegislationJSON } from "../fs/write-file";
import { api } from "./api";

const scrapeLegislation = async () => {
  const skipCache = getShouldSkipCache();
  const localeFromEnv = getLocale();

  forEachLocale(async (locale) => {
    console.info("scraping for locale:", locale);
    const legislation = await api[locale]({ skipCache });
    console.info("getting changes in legislation");
    const changes = await getLegislationChanges(locale, legislation);
    console.info("writing changes file");
    writeChangesJSON(locale, changes);
    console.info("writing locale file");
    writeLegislationJSON(locale, legislation);
  }, localeFromEnv);
};

const getLegislationChanges = async (
  locale: SupportedLocale,
  updatedLegislation: CiviLegislationData[]
) => {
  // Get the data from Github Pages that hasn't been changed yet.
  const oldLegislation = await getGHDeployedLegislation(locale);

  return findDifferences(oldLegislation, updatedLegislation);
};

scrapeLegislation();
