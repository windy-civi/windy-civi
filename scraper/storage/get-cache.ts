// Attempt to get files from filesystem, otherwise get from api
import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "../../domain";
import { githubReleases } from "./get-gh-releases";
import { fsBuilds } from "./get-filesytem";

export const getLegislation = async (
  locale: Locales
): Promise<CiviLegislationData[]> => {
  // First try getting the legislation from the filesystem
  try {
    return await fsBuilds.getLegislation(locale);
  } catch {
    // On fail, get from URL
    return githubReleases.getLegislation(locale);
  }
};

export const getGpt = async (
  locale: Locales
): Promise<CiviGptLegislationData> => {
  try {
    return await fsBuilds.getGpt(locale);
  } catch {
    return githubReleases.getGpt(locale);
  }
};

export const getChanges = async (
  locale: Locales
): Promise<LegislationChange[]> => {
  try {
    return await fsBuilds.getChanges(locale);
  } catch {
    return githubReleases.getChanges(locale);
  }
};

export const cache = {
  getLegislation,
  getGpt,
  getChanges,
};
