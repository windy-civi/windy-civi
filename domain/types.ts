import { RepLevel, SupportedLocale } from "./constants";
import { OfficialOffice } from "./representatives/representatives.types";

export type LegislationResult = {
  legislation: CiviLegislationData[];
  gpt: CiviGptLegislationData;
};

type CiviGptData = CiviGptLegislationData[keyof CiviGptLegislationData];

interface FilteredLegislationData {
  bill: CiviLegislationData;
  gpt?: CiviGptData;
  allTags: string[];
  level: RepLevel;
}

export type Sponsor = {
  name: string;
  role: string;
  district: string;
};

// Typing the .legislation.json files
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

export type CiviLegislationDataForDiff = Pick<
  CiviLegislationData,
  "id" | "status" | "statusDate" | "sponsors"
>;

export type LegislationChange = {
  id: string;
  differences: {
    added?: boolean;
    removed?: boolean;
    status?: { previous: string[]; new: string[] };
    statusDate?: { previous: string; new: string };
    sponsors?: {
      added: Sponsor[];
      removed: Sponsor[];
    };
  };
};

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

export interface DataStoreGetter {
  getLegislationData: (
    locale: SupportedLocale
  ) => Promise<CiviLegislationData[]>;
  getGptLegislation: (
    locale: SupportedLocale
  ) => Promise<CiviGptLegislationData>;
  locales: typeof SupportedLocale;
}

export type Env = {
  GOOGLE_API_KEY: string;
};

export type Locales = `${SupportedLocale}`;

export type LocationFilter = SupportedLocale | AddressFilter | Nullish;

export type AddressFilter = { address: string };

export type Nullish = undefined | "" | null;

export interface FilterParams {
  location: LocationFilter;
  tags: string[] | null;
  availableTags: string[];
  level: RepLevel | null;
}
