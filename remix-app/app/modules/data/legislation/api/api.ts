import axios from "axios";
import type {
  CiviGptLegislationData,
  CiviLegislationData,
} from "../../../../temp-civi-legislation-data/dist_api/types";
import { civiLegislationApi } from "../../../../temp-civi-legislation-data/dist_api/api";
import { DataStores } from "../../filters";
import { LegislationResult } from "../legislation.types";
import { legislationCache } from "./legislation-cache";

const getCachedLegislationData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0]
): Promise<CiviLegislationData[]> => {
  const cacheKey = `civi-legislation-data:${name}`;

  // return cache if it exists
  if (legislationCache.has(cacheKey)) {
    return legislationCache.get(cacheKey) as CiviLegislationData[];
  }

  const result = await axios.get<CiviLegislationData[]>(
    civiLegislationApi.getLegislationDataUrl(name)
  );

  const legislation = result.data;

  // set cache
  legislationCache.set(cacheKey, legislation);

  return legislation;
};

const getCachedLegislationGptData = async (
  name: Parameters<typeof civiLegislationApi.getLegislationDataUrl>[0]
): Promise<CiviGptLegislationData> => {
  const cacheKey = `civi-legislation-gpt-data:${name}`;

  // return cache if it exists
  if (legislationCache.has(cacheKey)) {
    return legislationCache.get(cacheKey) as CiviGptLegislationData;
  }

  const result = await axios.get<CiviGptLegislationData>(
    civiLegislationApi.getGptLegislationUrl(name)
  );

  const legislation = result.data;

  // set cache
  legislationCache.set(cacheKey, legislation);

  return legislation;
};

export const getLegislations = async (
  locale: DataStores
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
