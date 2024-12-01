import {
  CiviGptLegislationData,
  CiviLegislationData,
  CiviWikiLegislationData,
  LegislationChange,
  Locales,
} from "@windy-civi/domain/types";
import { default as fsNode } from "fs";
import path from "path";

export const writeJSON = (
  legislationDistFolder: string,
  name: string,
  json: object
) => {
  if (!fsNode.existsSync(legislationDistFolder)) {
    fsNode.mkdirSync(legislationDistFolder);
  }
  fsNode.writeFileSync(
    path.join(legislationDistFolder, `${name}.json`),
    JSON.stringify(json, null, 2),
    "utf-8"
  );
};

const saveChanges = (
  locale: Locales,
  cacheDir: string,
  differences: LegislationChange[]
) => {
  writeJSON(cacheDir, `${locale}.legislation.changes`, differences);
};

const saveGpt = (
  locale: Locales,
  cacheDir: string,
  gpt: CiviGptLegislationData
) => {
  writeJSON(cacheDir, `${locale}.legislation.gpt`, gpt);
};

const saveLegislation = (
  locale: Locales,
  cacheDir: string,
  legislation: CiviLegislationData[]
) => {
  writeJSON(cacheDir, `${locale}.legislation`, legislation);
};

const saveWiki = (
  locale: Locales,
  cacheDir: string,
  gpt: CiviWikiLegislationData[]
) => {
  writeJSON(cacheDir, `${locale}.legislation.wiki`, gpt);
};

export const fs = {
  saveChanges,
  saveGpt,
  saveLegislation,
  saveWiki,
};
