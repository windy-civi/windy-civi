import { WindyCiviBill } from "../types";
import {
  AVAILABLE_TAGS,
  ChicagoTags,
  RepLevel,
  SPONSORED_BY_REP_TAG,
  SupportedLocale,
} from "../constants";

import type { Locales, Nullish } from "../types";

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

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};

export const getLocale = (
  formattedAddress: string | Nullish
): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "chicago"
    : null;
};

export const isNullish = (location: unknown | Nullish): location is Nullish => {
  return [null, "", undefined].includes(location as string | null | undefined);
};

export const isSupportedLocale = (
  locationParam: unknown
): locationParam is SupportedLocale => {
  if (isNullish(locationParam)) {
    return false;
  }
  return Object.values(SupportedLocale).includes(
    locationParam as SupportedLocale
  );
};

// City Level
export const isCityLevel = (location: Locales): boolean =>
  isLocationChicago(location);

export const isLocationChicago = (location: Locales) =>
  isAddressChicago(location) || location === SupportedLocale.Chicago;

const isAddressChicago = (location: Locales) =>
  stringIsInAddress(
    ["Chicago, IL", "Chicago,IL", "Chicago, Illinois", "Chicago,Illinois"],
    location
  );

// State Level

export const isStateLevel = (location: Locales): boolean =>
  isLocationIL(location);

const isAddressIL = (location: Locales) =>
  stringIsInAddress([", IL", ",IL"], location);

export const isLocationIL = (location: Locales) =>
  isAddressIL(location) || location === SupportedLocale.Illinois;

const stringIsInAddress = (variations: string[], str: string) =>
  variations.some((variation) =>
    str.toLowerCase().includes(variation.toLowerCase())
  );

export const hasTags = (tags: unknown): tags is string[] => {
  return Boolean(tags && Array.isArray(tags) && tags.length > 0);
};

export const getTagsBeingFiltered = ({
  tags,
  availableTags,
}: {
  tags: string[];
  availableTags: string[];
}) => {
  return hasTags(tags) ? tags : availableTags;
};

export const stringifyTags = (tags: string[]) => {
  return tags.join(",");
};

export const parseRepLevel = (level?: string | null): RepLevel | null => {
  return !level ? null : level === "true" ? null : (level as RepLevel);
};

export const hasSponsoredByRepTag = (tags: string[] | null) =>
  tags?.includes(SPONSORED_BY_REP_TAG);

export const parseAvailableTags = (location: Locales) => {
  const availableTags = [];

  // TODO: Move to dynamic tags
  if (isLocationChicago(location)) {
    availableTags.push(...ChicagoTags);
  }

  availableTags.push(...AVAILABLE_TAGS);

  return availableTags;
};

export const getLocationInformationText = (location: Locales) => {
  let locationName = "";
  let levelText = "";
  if (isLocationChicago(location)) {
    locationName = "Chicago";
    levelText = "Local, State, & National";
  } else if (isLocationIL(location)) {
    locationName = "Illinois";
    levelText = "State & National";
  } else {
    locationName = "America";
    levelText = "National";
  }
  return { locationName, levelText };
};

export const getBillUpdateAt = (bill: WindyCiviBill) =>
  bill.bill.updated_at || bill.bill.statusDate;

export const tagsOverLap = (tagList1: unknown, tagList2: unknown) => {
  return (
    hasTags(tagList1) && hasTags(tagList2) && hasOverlap(tagList1, tagList2)
  );
};

export const hasOverlap = (arr1: string[], arr2: string[]): boolean => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return true;
    }
  }
  return false;
};

export const findOverlap = (arr1: string[], arr2: string[]): string | false => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return arr1[i];
    }
  }
  return false;
};

export const findStringOverlap = (arr1: string[], arr2: string[]) => {
  const overlap = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        overlap.push(arr1[i]);
      }
    }
  }

  return overlap;
};

export const isLocale = (locale: unknown): locale is Locales =>
  typeof locale === "string" &&
  Object.values(SupportedLocale).includes(locale as SupportedLocale);

export const localeValueToEnum = (locale: unknown): SupportedLocale | null => {
  switch (locale) {
    case "chicago":
      return SupportedLocale.Chicago;
    case "illinois":
      return SupportedLocale.Illinois;
    case "usa":
      return SupportedLocale.USA;
    default:
      return null;
  }
};

export const forEachLocale = (
  cb: (l: SupportedLocale) => void,
  locale?: SupportedLocale | null
): Error | null => {
  if (locale) {
    cb(locale);
  } else {
    for (const locale of Object.values(SupportedLocale)) {
      cb(locale);
    }
  }
  return null;
};

// Generated. Equal to Lodash uniqBy
export const uniqBy = <T extends object>(
  array: T[],
  keyExtractor: (item: T) => unknown
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyExtractor(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
