import { forEachLocale } from "../../domain/filters/filters.utils";
import { getLocale, getShouldSkipCache } from "../config/env";
import { writeLegislationJSON } from "../fs/write-file";
import { api } from "./api";

const scrapeLegislation = async () => {
  const skipCache = getShouldSkipCache();
  const localeFromEnv = getLocale();

  forEachLocale(async (locale) => {
    console.info("scraping for locale:", locale);
    const legislation = await api[locale]({ skipCache });
    writeLegislationJSON(locale, legislation);
  }, localeFromEnv);
};

scrapeLegislation();
