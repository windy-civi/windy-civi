// ## Legacy System Integration
//
// ### Legislation Types
// These types support integration with existing legislation data sources.

import { RepLevel } from "../locales";
import { toTitleCase } from "../scalars";
import { AllAllowedTags } from "../tags";

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

// ### Sponsor Information
export type Sponsor = {
  name: string;
  role: string;
  district: string;
};

// ### Core Legislation Data
// Represents the primary structure of legislation information.
export interface CiviLegislationData {
  status: string[];
  statusDate: string;
  id: string;
  title: string;
  link: string;
  url?: string;
  source_id: string;
  sponsors: Sponsor[];
  classification?: string;
  description?: string;
  tags?: string[];
  updated_at?: string;
  voteHistory?: { motion_classification: string[]; created_at: string }[];
  identifier?: string;
  bill_summary?: string;
  summaries?: {
    gpt: string;
  };
}

// ### Legislation Change Tracking
export type CiviLegislationDataForDiff = Partial<
  Pick<CiviLegislationData, "id" | "status" | "statusDate"> & {
    sponsors?: Partial<Sponsor>[];
  }
>;

export type LegislationChange = {
  id: string;
  differences: {
    added?: boolean;
    removed?: boolean;
    status?: { previous: string[] | null; new: string[] | null };
    statusDate?: { previous: string | null; new: string | null };
    sponsors?: {
      added: Partial<Sponsor>[] | null;
      removed: Partial<Sponsor>[] | null;
    };
  };
};

// ### GPT-Enhanced Data
export interface CiviGptLegislationData {
  [bill_id: string]: {
    gpt_summary: string;
    gpt_tags: string[];
  };
}

// ### Wiki Integration
export interface CiviWikiLegislationData {
  bill_id: string;
  summary: string;
  locale: string;
  date: string;
  tags: string[];
}

// ## Feed Processing Types

export type LegislationFeed = {
  fullLegislation: WindyCiviBill[];
  feed: WindyCiviBill[];
};

export type WindyCiviBill = {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  allTags: AllAllowedTags[];
  level: RepLevel;
};

export const getBillUpdateAt = (bill: WindyCiviBill) =>
  bill.bill.updated_at || bill.bill.statusDate;

// TODO: Move to backend
export const mapToReadableStatus = (
  level: RepLevel,
  status: string
): { name: string; type: "in-progress" | "pass" | "fail" } => {
  switch (level) {
    case RepLevel.City:
      switch (status) {
        case "introduction":
          return { name: "Introduced", type: "in-progress" };
        case "referral-committee":
          return { name: "In Committee", type: "in-progress" };
        case "passage":
          return { name: "Passed", type: "pass" };
        case "substitution":
          return { name: "Substituted", type: "in-progress" };
        case "committee-passage-favorable":
          return { name: "Recommended By Committee", type: "in-progress" };
        default:
          return {
            name: toTitleCase(status.split("-").join(" ")),
            type: "in-progress",
          };
      }
    case RepLevel.State:
      switch (status) {
        case "Pass":
          return { name: "Became Law", type: "pass" };
        default:
          return {
            name: "In Progress",
            type: "in-progress",
          };
      }
    case RepLevel.National:
      switch (status) {
        case "Engross":
          return { name: "Passed House", type: "in-progress" };
        case "Enroll":
          return {
            name: "Awaiting Presidential Approval",
            type: "in-progress",
          };
        case "Pass":
          return { name: "Became Law", type: "pass" };
      }
  }
  return { name: status, type: "in-progress" };
};

// TODO: We need to clean up the status data on the backend
export const getLastStatus = (status: unknown): string => {
  if (typeof status === "string") {
    try {
      const parsed = JSON.parse(status);
      return parsed[parsed.length - 1];
    } catch (e) {
      return status;
    }
  }
  if (Array.isArray(status)) {
    return status[status.length - 1];
  }
  return "";
};
