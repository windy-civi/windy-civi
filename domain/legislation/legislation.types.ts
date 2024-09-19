import { RepLevel } from "../filters/filters.constants";
import { CiviGptLegislationData, CiviLegislationData } from "../types";

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

export interface FilteredLegislationData {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  allTags: string[];
  level: RepLevel;
}
