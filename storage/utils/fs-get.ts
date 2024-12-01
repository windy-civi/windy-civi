import {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationChange,
  Locales,
} from "@windy-civi/domain";
import { default as fsNode } from "fs";
import path from "path";

const getLegislation = async (locale: Locales, cacheDir: string) => {
  const jsonStr = fsNode.readFileSync(
    path.join(cacheDir, `${locale}.legislation.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviLegislationData[];
  return legislations;
};

const getGpt = async (locale: Locales, cacheDir: string) => {
  const jsonStr = fsNode.readFileSync(
    path.join(cacheDir, `${locale}.legislation.gpt.json`),
    "utf8"
  );
  const legislations = JSON.parse(jsonStr) as CiviGptLegislationData;
  return legislations;
};

const getChanges = async (locale: Locales, cacheDir: string) => {
  const jsonStr = fsNode.readFileSync(
    path.join(cacheDir, `${locale}.legislation.changes.json`),
    "utf8"
  );
  const changes = JSON.parse(jsonStr) as LegislationChange[];
  return changes;
};

export const fs = {
  getLegislation,
  getGpt,
  getChanges,
};
