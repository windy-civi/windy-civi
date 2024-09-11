import type {
  CiviGptLegislationData,
  CiviLegislationData,
  Locales,
} from "../../../../../../../domain/types";
import { civiLegislationApi } from "../../../../../api/vite-api";
import { DataStores } from "../../filters";
import { LegislationResult } from "../legislation.types";
// import { legislationCache } from "./legislation-cache";

const getCachedLegislationData = async (
  name: Locales,
): Promise<CiviLegislationData[]> => {
  // const cacheKey = `civi-legislation-data:${name}`;

  // return cache if it exists
  // if (legislationCache.has(cacheKey)) {
  //   return legislationCache.get(cacheKey) as CiviLegislationData[];
  // }

  const legislation = await civiLegislationApi.getLegislationData(name);

  console.log({ legislation });
  // set cache
  // legislationCache.set(cacheKey, legislation);

  return legislation;
};

const getCachedLegislationGptData = async (
  name: Locales,
): Promise<CiviGptLegislationData> => {
  // const cacheKey = `civi-legislation-gpt-data:${name}`;

  // return cache if it exists
  // if (legislationCache.has(cacheKey)) {
  //   return legislationCache.get(cacheKey) as CiviGptLegislationData;
  // }
  const legislation = await civiLegislationApi.getGptLegislation(name);

  // set cache
  // legislationCache.set(cacheKey, legislation);

  return legislation;
};

export const getLegislations = async (
  locale: DataStores,
): Promise<LegislationResult> => {
  console.log("getting bills for", locale);
  let legislation: CiviLegislationData[] = [];
  let gpt: CiviGptLegislationData = {};
  switch (locale) {
    case DataStores.Chicago:
      legislation = await getCachedLegislationData("chicago");
      gpt = await getCachedLegislationGptData("chicago");
      break;
    case DataStores.Illinois:
      legislation = await getCachedLegislationData("illinois");
      gpt = await getCachedLegislationGptData("illinois");
      break;
    case DataStores.USA:
      legislation = await getCachedLegislationData("usa");
      gpt = await getCachedLegislationGptData("usa");
      break;
    default:
      break;
  }
  return { legislation, gpt };
};
