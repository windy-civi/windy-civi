import {
  CiviGptLegislationData,
  CiviLegislationData,
} from "../../../temp-civi-legislation-data/dist_api/types";
import { RepLevel } from "../filters/filters.constants";

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
