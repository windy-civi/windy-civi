// ## Data Access Layer

import { SupportedLocale } from "../locales";
import { CiviGptLegislationData, CiviLegislationData } from "../legislation";

export interface DataStoreGetter {
  getLegislationData: (
    locale: SupportedLocale
  ) => Promise<CiviLegislationData[]>;
  getGptLegislation: (
    locale: SupportedLocale
  ) => Promise<CiviGptLegislationData>;
  locales: typeof SupportedLocale;
}

// ## Environment and Configuration
// Yay! no env variables for now.
export type Env = null;
