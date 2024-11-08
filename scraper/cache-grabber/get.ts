// Attempt to get files from filesystem, otherwise get from api
import axios from "axios";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  Locales,
} from "../../domain";
import { getFsGpt, getFsLegislation } from "../fs/read-file";
import { civiLegislationApi } from "../api/api";

export const getGHDeployedLegislation = async (
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

const getGpt = async (locale: Locales): Promise<CiviGptLegislationData> => {
  try {
    // Get data from current release in GH
    const url = civiLegislationApi.getGptLegislationUrl(locale);
    const cachedResult = await axios.get<CiviGptLegislationData>(url);
    return cachedResult.data;
  } catch {
    return {};
  }
};

export const getCachedLegislation = async (locale: Locales) => {
  // First try getting the legislation from the filesystem
  try {
    return await getFsLegislation(locale);
  } catch {
    // On fail, get from URL
    return getGHDeployedLegislation(locale);
  }
};

export const getCachedGpt = async (locale: Locales) => {
  try {
    return await getFsGpt(locale);
  } catch {
    return getGpt(locale);
  }
};
