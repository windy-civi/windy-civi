import {
  CiviGptLegislationData,
  CiviLegislationData,
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

export const saveLegislation = (
  locale: Locales,
  cacheDir: string,
  legislation: CiviLegislationData[]
) => {
  writeJSON(cacheDir, `${locale}.legislation`, legislation);
};

export const saveChanges = (
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

export const fs = {
  saveGpt,
  saveChanges,
  saveLegislation,
};
