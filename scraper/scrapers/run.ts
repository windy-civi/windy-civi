import { forEachLocale } from "@windycivi/domain/utils";
import { getLocale, getShouldSkipCache } from "../config/env";
import { writeLegislationJSON } from "../fs/write-file";
import { api } from "./api";

const scrapeLegislation = async () => {
  const skipCache = getShouldSkipCache();
  const locale = getLocale();

  forEachLocale(async (locale) => {
    console.info("scraping for locale:", locale);
    const legislation = await api[locale]({ skipCache });
    writeLegislationJSON(locale, legislation);
  }, locale);
};

scrapeLegislation();
