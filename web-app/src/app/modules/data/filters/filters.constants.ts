import type { FilterParams } from "./filters.types";

export const ALLOWED_GPT_TAGS = [
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "States Rights",
  "Civil Rights",
  "Climate Change",
  "Other",
];

// City level filters for tags that are not GPT tags
export enum CustomChicagoTag {
  "Ordinance" = "City Wide Ordinance",
  "Resolution" = "City Wide Resolution",
}

export const ChicagoTags = Object.values(CustomChicagoTag);

export const SPONSORED_BY_REP_TAG = "Bills Sponsored By Your Representatives";

export const AVAILABLE_TAGS = [...ALLOWED_GPT_TAGS];

export enum RepLevel {
  City = "city",
  County = "county",
  State = "state",
  National = "national",
}

export enum SupportedLocale {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
}

export enum DataStores {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
}

export const DEFAULT_FILTERS: FilterParams = {
  location: null,
  level: null,
  tags: null,
  availableTags: AVAILABLE_TAGS,
};
