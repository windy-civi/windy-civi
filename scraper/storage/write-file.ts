import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "../../domain/types";
import fs from "fs";
import path from "path";

export const legislationDistFolder = path.join(
  __dirname,
  "../",
  "dist_legislation"
);

export const writeJSON = (name: string, json: object) => {
  if (!fs.existsSync(legislationDistFolder)) {
    fs.mkdirSync(legislationDistFolder);
  }
  fs.writeFileSync(
    path.join(legislationDistFolder, `${name}.json`),
    JSON.stringify(json, null, 2),
    "utf-8"
  );
};

export const writeLegislationJSON = (
  locale: Locales,
  legislation: CiviLegislationData[]
) => {
  writeJSON(`${locale}.legislation`, legislation);
};

export const writeChangesJSON = (
  locale: Locales,
  differences: LegislationChange[]
) => {
  writeJSON(`${locale}.legislation.changes`, differences);
};

export const writeGptJSON = (locale: Locales, gpt: CiviGptLegislationData) => {
  writeJSON(`${locale}.legislation.gpt`, gpt);
};
