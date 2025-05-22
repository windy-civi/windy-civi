import {
  isLocale,
  localeValueToEnum,
  SupportedLocale,
} from "@windy-civi/domain/locales";
import path from "path";

export const getShouldSkipCache = () => {
  const skipCache =
    process.env.SKIP_CACHE === "true" || process.env.SKIP_CACHE === "1";

  if (skipCache) {
    console.info("skipping cached data.");
  }
  return skipCache;
};

export const getLocale = (): SupportedLocale | null => {
  const locale = process.env.LOCALE;
  if (!locale) {
    return null;
  }
  if (!isLocale(locale)) {
    console.error("Invalid locale provided");
    process.exit(1);
  } else {
    return localeValueToEnum(locale);
  }
};

export const getLegiscanAPIKey = () => {
  if (!process.env.LEGISCAN_API_KEY) {
    console.error("Need to provide LEGISCAN_API_KEY as environment var");
    process.exit(1);
  }
  return process.env.LEGISCAN_API_KEY;
};

export const getOpenAIAPIKey = () => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!process.env.OPENAI_API_KEY) {
    console.error("Need to provide OPENAI_API_KEY as environment var");
    process.exit(1);
  }
  return OPENAI_API_KEY;
};

export const getGoogleSheetAPIKey = () => {
  const apiKey = process.env.GOOGLE_SPREADSHEET_API_KEY;
  if (!apiKey) {
    console.error(
      "Need to provide GOOGLE_SPREADSHEET_API_KEY as environment var"
    );
    process.exit(1);
  }
  return apiKey;
};

export const getCacheDir = () => {
  return path.join(__dirname, "../", "dist_legislation");
};
