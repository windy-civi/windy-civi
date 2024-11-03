import { SupportedLocale } from "../../domain/constants";
import { Locales } from "../../domain/types";

export const civiLegislationApi = {
  getLegislationDataUrl: (locale: Locales): string => {
    return `https://github.com/sartaj/windy-civi/releases/download/nightly/${locale}.legislation.json`;
  },
  getGptLegislationUrl: (locale: Locales): string => {
    return `https://github.com/sartaj/windy-civi/releases/download/nightly/${locale}.legislation.gpt.json`;
  },
  locales: SupportedLocale,
};
