import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "../../domain";
import fs from "fs";
import path from "path";

const DIST_FOLDER = path.join(__dirname, "../dist_legislation");

const getLegislation = async (locale: Locales) => {
  const jsonStr = fs.readFileSync(
    path.join(DIST_FOLDER, `${locale}.legislation.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviLegislationData[];
  return legislations;
};

const getGpt = async (locale: Locales) => {
  const jsonStr = fs.readFileSync(
    path.join(DIST_FOLDER, `${locale}.legislation.gpt.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviGptLegislationData;
  return legislations;
};

const getChanges = async (locale: Locales) => {
  const jsonStr = fs.readFileSync(
    path.join(DIST_FOLDER, `${locale}.legislation.changes.json`),
    "utf8"
  );
  const changes = JSON.parse(jsonStr) as LegislationChange[];
  return changes;
};

export const fsBuilds = {
  getLegislation,
  getGpt,
  getChanges,
};
