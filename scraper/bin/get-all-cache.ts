// Download Current release data from the API and write it to the filesystem

import { forEachLocale } from "../../domain/filters/filters.utils";
import {
  writeChangesJSON,
  writeGptJSON,
  writeLegislationJSON,
} from "../storage/write-file";
import { cache } from "../storage/get-cache";

export const retrieveCurrentRelease = async () => {
  try {
    forEachLocale(async (locale) => {
      const legislation = await cache.getLegislation(locale);
      const gpt = await cache.getGpt(locale);
      const changes = await cache.getChanges(locale);
      writeLegislationJSON(locale, legislation);
      writeGptJSON(locale, gpt);
      writeChangesJSON(locale, changes);
    });
  } catch (e) {
    console.error("Error retrieving current release data");
    console.error(e);
    process.exit(1);
  }
};

retrieveCurrentRelease();
