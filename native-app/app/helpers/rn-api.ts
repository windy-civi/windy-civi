import { github } from "../utils/gh-get";
import { DataStoreGetter } from "@windy-civi/domain/drivers";
import {
  CiviGptLegislationData,
  CiviLegislationData,
} from "@windy-civi/domain/legislation";
import { SupportedLocale } from "@windy-civi/domain/locales";

export const rnDataGetter: DataStoreGetter = {
  getLegislationData: (locale) => legislationApi[locale](),
  getGptLegislation: (locale) => gptApi[locale](),
  locales: SupportedLocale,
};

// todo: this depends on the scraper repo to be installed, and the legislation to be there. Make this more decoupled.
const legislationApi: Record<
  SupportedLocale,
  () => Promise<CiviLegislationData[]>
> = {
  [SupportedLocale.Chicago]: () => github.getLegislation("chicago"),
  [SupportedLocale.Illinois]: () => github.getLegislation("illinois"),
  [SupportedLocale.USA]: () => github.getLegislation("usa"),
};

const gptApi: Record<SupportedLocale, () => Promise<CiviGptLegislationData>> = {
  [SupportedLocale.Chicago]: () => github.getGpt("chicago"),
  [SupportedLocale.Illinois]: () => github.getGpt("illinois"),
  [SupportedLocale.USA]: () => github.getGpt("usa"),
};
