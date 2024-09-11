import {
  locales,
  Locales,
  CiviLegislationData,
  CiviGptLegislationData,
} from "@windycivi/domain/types";

export const civiLegislationApi = {
  getLegislationData: (locale: Locales): Promise<CiviLegislationData[]> => {
    return legislationApi[locale]();
  },
  getGptLegislation: (locale: Locales): Promise<CiviGptLegislationData> => {
    return gptApi[locale]();
  },
  locales,
};

const legislationApi: Record<Locales, () => Promise<CiviLegislationData[]>> = {
  chicago: () =>
    import("./data/chicago.legislation.json").then((m) => m.default) as Promise<
      CiviLegislationData[]
    >,
  illinois: () =>
    import("./data/illinois.legislation.json").then((m) => m.default),
  usa: () =>
    import("./data/usa.legislation.json").then(
      (m) => m.default
    ) as unknown as Promise<CiviLegislationData[]>,
};

const gptApi: Record<Locales, () => Promise<CiviGptLegislationData>> = {
  chicago: () =>
    import("./data/chicago.legislation.gpt.json").then(
      (m) => m.default
    ) as unknown as Promise<CiviGptLegislationData>,
  illinois: () =>
    import("./data/illinois.legislation.gpt.json").then(
      (m) => m.default
    ) as unknown as Promise<CiviGptLegislationData>,
  usa: () =>
    import("./data/usa.legislation.gpt.json").then(
      (m) => m.default
    ) as unknown as Promise<CiviGptLegislationData>,
};
