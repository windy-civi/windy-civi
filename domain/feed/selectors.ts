import { ALLOWED_GPT_TAGS, CustomChicagoTag, RepLevel } from "../constants";
import type {
  CiviGptLegislationData,
  CiviLegislationData,
  LegislationResult,
  WindyCiviBill,
} from "../types";
import { findStringOverlap, getBillUpdateAt } from "./utils";

// End Rep Filters

// Start Chicago Filters
const filterOnlyImportantCityBills = (bill: CiviLegislationData) =>
  isChicagoImportantOrdinance(bill) || isChicagoResolution(bill);

const isChicagoImportantOrdinance = (bill: CiviLegislationData) => {
  return (
    bill.classification === "ordinance" &&
    bill.tags?.includes("City Matters") &&
    bill.tags?.includes("Municipal Code")
  );
};

const isChicagoResolution = (bill: CiviLegislationData) => {
  return (
    bill.classification === "resolution" &&
    !bill.tags?.includes("City Council Rules") &&
    !bill.title.toLowerCase().includes("birthday")
  );
};

export const filterNoisyCityBills = () => (bill: WindyCiviBill) => {
  return filterOnlyImportantCityBills(bill.bill);
};

// End Chicago Filters

// Start Default Filters

export const filterBillsOlderThanSixMonths = (bill: WindyCiviBill) => {
  const updated = (bill.bill.updated_at =
    bill.bill.updated_at || bill.bill.statusDate);
  if (!updated) {
    return false;
  }
  return !isDateOlderThanSixMonths(updated);
};

// Generated from GPT
const isDateOlderThanSixMonths = (dateString: string) => {
  // Parse the input date string into a Date object
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
  const day = parseInt(dateParts[2], 10);
  const inputDate = new Date(year, month, day);

  // Calculate date 6 months ago from now
  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    currentDate.getDate()
  );

  // Compare input date with 6 months ago date
  return inputDate < sixMonthsAgo;
};

// Mainly just filtering by state bills for now.
const DEFAULT_FILTERS = [filterBillsOlderThanSixMonths];

export const sortByUpdatedAt = (bills: WindyCiviBill[]) => {
  return bills.sort((a, b) => {
    const aUpdated = getBillUpdateAt(a);
    const bUpdated = getBillUpdateAt(b);
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });
};

// End Default Filters

// Start Main Filter Functions

const createFeedBill =
  (gpt: CiviGptLegislationData, level: RepLevel) =>
  (bill: CiviLegislationData): WindyCiviBill => {
    const gptSummaries = gpt[bill.id] || {};
    // todo: move to civi-legislation-data
    let gptTags = gptSummaries.gpt_tags || [];

    // Remove Other filter
    gptTags = gptTags.filter((str) => str !== "Other");

    // Verify GPT tag exists in allowed tags
    gptTags = findStringOverlap(gptTags, ALLOWED_GPT_TAGS);

    // if it has no categories, add other
    if (gptTags.length === 0) {
      gptTags.push("Other");
    }

    const cleanedGpt = {
      gpt_summary: gptSummaries.gpt_summary,
      gpt_tags: gptTags,
    };

    // move this to the generated data
    const chicagoTags = isChicagoImportantOrdinance(bill)
      ? [CustomChicagoTag.Ordinance]
      : isChicagoResolution(bill)
      ? [CustomChicagoTag.Resolution]
      : [];

    const allTags = [...chicagoTags, ...gptTags];

    return {
      bill,
      gpt: cleanedGpt,
      allTags,
      level,
    } as WindyCiviBill;
  };

type FeedBillArrayFilter = (bill: WindyCiviBill) => boolean;

export const createFeedBillsFromMultipleSources = (
  dataStores: [
    LegislationResult | null | false,
    RepLevel,
    FeedBillArrayFilter[] | null
  ][]
) => {
  const allBills = [] as WindyCiviBill[];
  dataStores.forEach(([legislationResult, repLevel, extraFilters]) => {
    let localeBills = [] as WindyCiviBill[];
    if (!legislationResult) {
      return [] as WindyCiviBill[];
    }
    // Create the for you bill structure
    localeBills = legislationResult.legislation.map(
      createFeedBill(legislationResult.gpt, repLevel)
    );

    // Filter by default filters
    DEFAULT_FILTERS.forEach((filterFunc) => {
      localeBills = localeBills.filter(filterFunc);
    });

    // Filter any extra filters if they exist
    extraFilters?.forEach((filter) => {
      localeBills = localeBills.filter(filter);
    });

    // Add them too the bill total
    allBills.push(...localeBills);
  });

  // Return all bills
  return allBills;
};

// End Main Filter Functions
