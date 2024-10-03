import {
  locales,
  Locales,
  CiviLegislationData,
  CiviGptLegislationData,
  DataStoreGetter,
} from "@windycivi/domain/types";

export const viteDataGetter: DataStoreGetter = {
  getLegislationData: (locale) => legislationApi[locale](),
  getGptLegislation: (locale) => gptApi[locale](),
  locales,
};

// todo: this depends on the scraper repo to be installed, and the legislation to be there. Make this more decoupled.
const legislationApi: Record<Locales, () => Promise<CiviLegislationData[]>> = {
  chicago: () =>
    import("../../../scraper/dist_legislation/chicago.legislation.json").then(
      (m) => m.default,
    ) as Promise<CiviLegislationData[]>,
  illinois: () =>
    import("../../../scraper/dist_legislation/illinois.legislation.json").then(
      (m) => m.default,
    ),
  usa: () =>
    import("../../../scraper/dist_legislation/usa.legislation.json").then(
      (m) => m.default,
    ) as unknown as Promise<CiviLegislationData[]>,
};

const gptApi: Record<Locales, () => Promise<CiviGptLegislationData>> = {
  chicago: () =>
    import(
      "../../../scraper/dist_legislation/chicago.legislation.gpt.json"
    ).then((m) => m.default) as unknown as Promise<CiviGptLegislationData>,
  illinois: () =>
    import(
      "../../../scraper/dist_legislation/illinois.legislation.gpt.json"
    ).then((m) => m.default) as unknown as Promise<CiviGptLegislationData>,
  usa: () =>
    import("../../../scraper/dist_legislation/usa.legislation.gpt.json").then(
      (m) => m.default,
    ) as unknown as Promise<CiviGptLegislationData>,
};
