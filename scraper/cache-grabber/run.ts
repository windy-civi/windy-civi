// Download Current release data from the API and write it to the filesystem

import { forEachLocale } from "../../domain/filters/filters.utils";
import { writeGptJSON, writeLegislationJSON } from "../fs/write-file";
import { getCachedGpt, getCachedLegislation } from "./get";

export const retrieveCurrentRelease = async () => {
  try {
    forEachLocale(async (locale) => {
      const legislation = await getCachedLegislation(locale);
      const gpt = await getCachedGpt(locale);
      writeLegislationJSON(locale, legislation);
      writeGptJSON(locale, gpt);
    });
  } catch (e) {
    console.error("Error retrieving current release data");
    console.error(e);
    process.exit(1);
  }
};

retrieveCurrentRelease();
