#! /usr/bin/env node

import { forEachLocale } from "@windy-civi/domain/filters/filters.utils";
import path from "path";
import { fs } from "./utils/fs-save";
import { storage } from ".";

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

type SaveAllParams = Parameters<typeof downloadAll>;

const commands = Object.keys(downloadAll);

const getCommandArg = () => {
  const firstArg = process.argv[2];
  if (commands.includes(firstArg)) {
    console.error(`first argument must be of type ${commands.join(" ")}`);
    process.exit(1);
  }

  return firstArg as SaveAllParams[0];
};

const getCacheDir = () =>
  path.join(
    process.cwd(),
    process.argv[3] || "legislation_dist"
  ) as SaveAllParams[1];

downloadAll(getCommandArg(), getCacheDir());
