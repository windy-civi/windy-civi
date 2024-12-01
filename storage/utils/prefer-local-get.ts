// Attempt to get files from filesystem, otherwise get from api
import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "@windy-civi/domain";
import { fs } from "./fs-get";
import { github } from "./gh-get";

const getLegislation = async (
  locale: Locales,
  cacheDir: string
): Promise<CiviLegislationData[]> => {
  // First try getting the legislation from the filesystem
  try {
    return await fs.getLegislation(locale, cacheDir);
  } catch {
    // On fail, get from URL
    return github.getLegislation(locale);
  }
};

const getGpt = async (
  locale: Locales,
  cacheDir: string
): Promise<CiviGptLegislationData> => {
  try {
    return await fs.getGpt(locale, cacheDir);
  } catch {
    return github.getGpt(locale);
  }
};

const getChanges = async (
  locale: Locales,
  cacheDir: string
): Promise<LegislationChange[]> => {
  try {
    return await fs.getChanges(locale, cacheDir);
  } catch {
    return github.getChanges(locale);
  }
};

export const preferLocal = {
  getLegislation,
  getGpt,
  getChanges,
};
