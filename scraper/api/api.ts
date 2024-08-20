import { locales, Locales } from "./types";

export const civiLegislationApi = {
  getLegislationDataUrl: (locale: Locales): string => {
    return `https://github.com/civi-social/civi-legislation-data/releases/download/nightly/${locale}.legislation.json`;
  },
  getGptLegislationUrl: (locale: Locales): string => {
    return `https://github.com/civi-social/civi-legislation-data/releases/download/nightly/${locale}.legislation.gpt.json`;
  },
  locales,
};
