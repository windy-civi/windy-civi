import axios from "axios";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "../domain/types";

const getLegislation = async (
  locale: Locales
): Promise<CiviLegislationData[]> => {
  try {
    // Get previous data from current release in GH
    const url = `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.json`;
    const cachedResult = await axios.get<CiviLegislationData[]>(url);
    return cachedResult.data;
  } catch {
    return [];
  }
};

const getGpt = async (locale: Locales): Promise<CiviGptLegislationData> => {
  try {
    // Get data from current release in GH
    const url = `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.gpt.json`;
    const cachedResult = await axios.get<CiviGptLegislationData>(url);
    return cachedResult.data;
  } catch {
    return {};
  }
};

const getChanges = async (locale: Locales): Promise<LegislationChange[]> => {
  try {
    // Get data from current release in GH
    const url = `https://github.com/windy-civi/windy-civi/releases/download/nightly/${locale}.legislation.changes.json`;
    const cachedResult = await axios.get<LegislationChange[]>(url);
    return cachedResult.data;
  } catch {
    return [];
  }
};

export const github = {
  getLegislation,
  getGpt,
  getChanges,
};
