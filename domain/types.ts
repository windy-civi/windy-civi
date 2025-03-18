import { AllAllowedTags, RepLevel, SupportedLocale } from "./constants";

// ## Legacy System Integration
//
// ### Legislation Types
// These types support integration with existing legislation data sources.

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

interface FilteredLegislationData {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  allTags: AllAllowedTags[];
  level: RepLevel;
}

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

export type WindyCiviBill = FilteredLegislationData;

// ## Data Access Layer

export interface DataStoreGetter {
  getLegislationData: (
    locale: SupportedLocale
  ) => Promise<CiviLegislationData[]>;
  getGptLegislation: (
    locale: SupportedLocale
  ) => Promise<CiviGptLegislationData>;
  locales: typeof SupportedLocale;
}

// ## Environment and Configuration
// Yay! no env variables for now.
export type Env = null;

// ## Localization and Filtering

export type Locales = `${SupportedLocale}`;

export type Nullish = undefined | "" | null;

export interface FilterParams {
  location: Locales;
  tags: string[] | null;
}

export type UserPreferences = {
  location: Locales; // source locale, which can be composed. For example, "chicago" -> "usa"
  tags: AllAllowedTags[]; // list of Tag IDs user wants to subscribe to
  // theme: string; // theme user wants to use for the ForYou page
};
