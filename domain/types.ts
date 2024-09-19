import { FilteredLegislationData } from "./legislation/legislation.types";
import { OfficialOffice } from "./representatives";

// Typing the .legislation.json files
export interface CiviLegislationData {
  status: string[];
  statusDate: string;
  id: string;
  title: string;
  link: string;
  url?: string;
  source_id: string;
  sponsors: { name: string; role: string; district: string }[];
  classification?: string;
  description?: string;
  tags?: string[];
  updated_at?: string;
  voteHistory?: { motion_classification: string[]; created_at: string }[];
  identifier?: string;
  summaries?: {
    gpt: string;
  };
}

// Type for the .gpt.json files
export interface CiviGptLegislationData {
  [bill_id: string]: {
    gpt_summary: string;
    gpt_tags: string[];
  };
}

// Typing the wiki.json files
export interface CiviWikiLegislationData {
  bill_id: string;
  summary: string;
  locale: string;
  date: string;
  tags: string[];
}

export const locales = ["chicago", "illinois", "usa"] as const;

export type Locales = (typeof locales)[number];

export type FeedData = {
  fullLegislation: WindyCiviBill[];
  filteredLegislation: WindyCiviBill[];
  offices: OfficialOffice[] | null;
};

export interface WindyCiviBill extends FilteredLegislationData {
  // String that is the name of the rep that sponsored the bill
  // note: this should become a OfficialOffice object
  sponsoredByRep?: string | false;
}
