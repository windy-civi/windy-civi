import { forEachLocale } from "@windy-civi/domain/filters/filters.utils";
import { fs } from "./fs-save";
import { storage } from "..";

export const downloadAll = async (
  command: keyof typeof storage,
  cacheDir: string
) => {
  try {
    forEachLocale(async (locale) => {
      const store = storage[command];
      const legislation = await store.getLegislation(locale, cacheDir);
      const gpt = await store.getGpt(locale, cacheDir);
      const changes = await store.getChanges(locale, cacheDir);
      fs.saveLegislation(locale, cacheDir, legislation);
      fs.saveGpt(locale, cacheDir, gpt);
      fs.saveChanges(locale, cacheDir, changes);
    });
  } catch (e) {
    console.error("Error retrieving current release data");
    console.error(e);
    process.exit(1);
  }
};
