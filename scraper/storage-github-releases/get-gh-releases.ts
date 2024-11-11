import axios from "axios";
import { SupportedLocale } from "../../domain/constants";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "../../domain/types";

export const civiLegislationApi = {
  getLegislationDataUrl: (locale: Locales): string => {
    return `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.json`;
  },
  getGptLegislationUrl: (locale: Locales): string => {
    return `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.gpt.json`;
  },
  getChangesLegislationUrl: (locale: Locales): string => {
    return `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.changes.json`;
  },
  locales: SupportedLocale,
};

const getGHDeployedLegislation = async (
  locale: Locales
): Promise<CiviLegislationData[]> => {
  try {
    // Get previous data from current release in GH
    const url = civiLegislationApi.getLegislationDataUrl(locale);
    const cachedResult = await axios.get<CiviLegislationData[]>(url);
    return cachedResult.data;
  } catch {
    return [];
  }
};

const getGHDeployedChanges = async (
  locale: Locales
): Promise<LegislationChange[]> => {
  try {
    // Get data from current release in GH
    const url = civiLegislationApi.getChangesLegislationUrl(locale);
    const cachedResult = await axios.get<LegislationChange[]>(url);
    return cachedResult.data;
  } catch {
    return [];
  }
};

const getGHDeployedGpt = async (
  locale: Locales
): Promise<CiviGptLegislationData> => {
  try {
    // Get data from current release in GH
    const url = civiLegislationApi.getGptLegislationUrl(locale);
    const cachedResult = await axios.get<CiviGptLegislationData>(url);
    return cachedResult.data;
  } catch {
    return {};
  }
};

export const githubReleases = {
  getLegislation: getGHDeployedLegislation,
  getGpt: getGHDeployedGpt,
  getChanges: getGHDeployedChanges,
};
