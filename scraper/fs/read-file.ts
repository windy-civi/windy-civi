import { CiviGptLegislationData, CiviLegislationData, Locales } from "../../api";
import fs from "fs";
import path from "path";

const DIST_FOLDER = path.join(__dirname, "../dist_legislation");

export const getFsLegislation = async (locale: Locales) => {
  const jsonStr = fs.readFileSync(
    path.join(DIST_FOLDER, `${locale}.legislation.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviLegislationData[];
  return legislations;
};

export const getFsGpt = async (locale: Locales) => {
  const jsonStr = fs.readFileSync(
    path.join(DIST_FOLDER, `${locale}.legislation.gpt.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviGptLegislationData;
  return legislations;
};
