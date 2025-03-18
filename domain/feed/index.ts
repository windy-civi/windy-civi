import { DataStoreGetter } from "../drivers";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  getBillUpdateAt,
  LegislationFeed,
  LegislationResult,
  WindyCiviBill,
} from "../legislation";
import {
  DataStores,
  isLocationChicago,
  isLocationIL,
  SupportedLocale,
  TOTAL_REPRESENTATIVES,
} from "../locales";
import { findStringOverlap, uniqBy } from "../scalars";
import {
  AllAllowedTags,
  ALLOWED_TAGS,
  CustomChicagoTag,
  DEFAULT_TAG_PREFERENCES,
} from "../tags";
import { UserPreferences } from "../user-preferences";

// Types
type FeedBillArrayFilter = (bill: WindyCiviBill) => boolean;

// Constants and Configuration
const LOCALE_PRIORITIES: Record<SupportedLocale, number> = {
  [SupportedLocale.USA]: 4,
  [SupportedLocale.Illinois]: 3,
  [SupportedLocale.Chicago]: 2,
};

const SCORING_WEIGHTS = {
  billType: 0.3, // Highest weight on de-prioritizing resolutions
  tags: 0.25, // Followed by tag relevance
  popularity: 0.2, // Then popularity
  freshness: 0.15, // Then freshness
  level: 0.05, // Then government level
};

// Utility Functions
const isDateOlderThanSixMonths = (dateString: string) => {
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
  const day = parseInt(dateParts[2], 10);
  const inputDate = new Date(year, month, day);

  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    currentDate.getDate()
  );

  return inputDate < sixMonthsAgo;
};

// Chicago-specific utility functions
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

const filterOnlyImportantCityBills = (bill: CiviLegislationData) =>
  isChicagoImportantOrdinance(bill) || isChicagoResolution(bill);

// Scoring Functions
const calculateTagScore = (
  userTags: UserPreferences["tags"] = DEFAULT_TAG_PREFERENCES,
  itemTags?: AllAllowedTags[]
): number => {
  if (!itemTags || itemTags.length === 0) return 0;

  const matchedTags = userTags.filter((tag) => itemTags.includes(tag));
  const overlapBooster = matchedTags.length * 3;

  return Math.min(overlapBooster / ALLOWED_TAGS.length, 1);
};

const calculateFreshnessScore = (item: WindyCiviBill): number => {
  const updateDate = getBillUpdateAt(item);
  const now = new Date().getTime();
  const updateTimestamp = new Date(updateDate).getTime();
  const ageInDays = (now - updateTimestamp) / (1000 * 60 * 60 * 24);

  return Math.exp(-ageInDays / 30);
};

const calculateLocaleScore = (locale: SupportedLocale): number => {
  return (
    LOCALE_PRIORITIES[locale] / Math.max(...Object.values(LOCALE_PRIORITIES))
  );
};

const calculatePopularityScore = (item: WindyCiviBill): number => {
  const bill = item.bill;
  if (!bill.sponsors) {
    return 0;
  }

  let totalReps = 0;
  const baselineScore = Math.min(bill.sponsors.length / 10, 1);

  switch (item.locale) {
    case SupportedLocale.USA:
      totalReps = TOTAL_REPRESENTATIVES[SupportedLocale.USA].TOTAL;
      break;
    case SupportedLocale.Illinois:
      if (bill.source_id.startsWith("IL")) {
        totalReps = TOTAL_REPRESENTATIVES[SupportedLocale.Illinois].TOTAL;
      }
      break;
    case SupportedLocale.Chicago:
      if (bill.source_id.startsWith("CHI")) {
        totalReps = TOTAL_REPRESENTATIVES[SupportedLocale.Chicago].TOTAL;
      }
      break;
    default:
      return baselineScore;
  }

  const sponsorPercentage =
    totalReps > 0 ? bill.sponsors.length / totalReps : 0;
  return Math.min(sponsorPercentage, 1);
};

const calculateBillTypeScore = (item: WindyCiviBill): number => {
  const { classification, id } = item.bill;

  if (item.locale === SupportedLocale.USA) {
    const billId = id.toUpperCase();
    return billId.startsWith("HR ") || billId.startsWith("S ") ? 1.0 : 0.0;
  }

  if (item.locale === SupportedLocale.Chicago) {
    const classificationLower = classification?.toLowerCase();
    return classificationLower === "bill" || classificationLower === "ordinance"
      ? 1.0
      : 0.0;
  }

  return 0.0;
};

const calculateTotalScore = (
  preferences: UserPreferences,
  item: WindyCiviBill
): number => {
  const tagScore = calculateTagScore(preferences.tags, item.allTags);
  const freshnessScore = calculateFreshnessScore(item);
  const levelScore = calculateLocaleScore(item.locale);
  const popularityScore = calculatePopularityScore(item);
  const billTypeScore = calculateBillTypeScore(item);

  return (
    tagScore * SCORING_WEIGHTS.tags +
    freshnessScore * SCORING_WEIGHTS.freshness +
    levelScore * SCORING_WEIGHTS.level +
    popularityScore * SCORING_WEIGHTS.popularity +
    billTypeScore * SCORING_WEIGHTS.billType
  );
};

// Core Business Logic Functions
const getLegislation = async (
  dataStoreGetter: DataStoreGetter,
  locale: DataStores
): Promise<LegislationResult> => {
  console.log("getting bills for", locale);
  let legislation: CiviLegislationData[] = [];
  let gpt: CiviGptLegislationData = {};
  switch (locale) {
    case DataStores.Chicago:
      legislation = await dataStoreGetter.getLegislationData(
        SupportedLocale.Chicago
      );
      gpt = await dataStoreGetter.getGptLegislation(SupportedLocale.Chicago);
      break;
    case DataStores.Illinois:
      legislation = await dataStoreGetter.getLegislationData(
        SupportedLocale.Illinois
      );
      gpt = await dataStoreGetter.getGptLegislation(SupportedLocale.Illinois);
      break;
    case DataStores.USA:
      legislation = await dataStoreGetter.getLegislationData(
        SupportedLocale.USA
      );
      gpt = await dataStoreGetter.getGptLegislation(SupportedLocale.USA);
      break;
    default:
      break;
  }
  return { legislation, gpt };
};

const createFeedBill =
  (gpt: CiviGptLegislationData, locale: SupportedLocale) =>
  (bill: CiviLegislationData): WindyCiviBill => {
    const gptSummaries = gpt[bill.id] || {};
    let gptTags = gptSummaries.gpt_tags || [];

    gptTags = gptTags.filter((str) => str !== "Other");
    gptTags = findStringOverlap(gptTags, ALLOWED_TAGS);

    if (gptTags.length === 0) {
      gptTags.push("Other");
    }

    const cleanedGpt = {
      gpt_summary: gptSummaries.gpt_summary,
      gpt_tags: gptTags,
    };

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
      locale,
    } as WindyCiviBill;
  };

// Exported Functions and Filters
export const filterNoisyCityBills = () => (bill: WindyCiviBill) => {
  return filterOnlyImportantCityBills(bill.bill);
};

export const filterBillsOlderThanSixMonths = (bill: WindyCiviBill) => {
  const updated = (bill.bill.updated_at =
    bill.bill.updated_at || bill.bill.statusDate);
  if (!updated) {
    return false;
  }
  return !isDateOlderThanSixMonths(updated);
};

const DEFAULT_FILTERS = [filterBillsOlderThanSixMonths];

export const sortByUpdatedAt = (bills: WindyCiviBill[]) => {
  return bills.sort((a, b) => {
    const aUpdated = getBillUpdateAt(a);
    const bUpdated = getBillUpdateAt(b);
    return Date.parse(bUpdated) - Date.parse(aUpdated);
  });
};

export const createFeedBillsFromMultipleSources = (
  dataStores: [
    LegislationResult | null | false,
    SupportedLocale,
    FeedBillArrayFilter[] | null
  ][]
) => {
  const allBills = [] as WindyCiviBill[];
  dataStores.forEach(([legislationResult, locale, extraFilters]) => {
    let localeBills = [] as WindyCiviBill[];
    if (!legislationResult) {
      return [] as WindyCiviBill[];
    }

    localeBills = legislationResult.legislation.map(
      createFeedBill(legislationResult.gpt, locale)
    );

    DEFAULT_FILTERS.forEach((filterFunc) => {
      localeBills = localeBills.filter(filterFunc);
    });

    extraFilters?.forEach((filter) => {
      localeBills = localeBills.filter(filter);
    });

    allBills.push(...localeBills);
  });

  return allBills;
};

export const sortLegislationByScore = (
  legislation: WindyCiviBill[],
  preferences: UserPreferences
): WindyCiviBill[] => {
  return [...legislation].sort((a, b) => {
    const scoreA = calculateTotalScore(preferences, a);
    const scoreB = calculateTotalScore(preferences, b);
    return scoreB - scoreA;
  });
};

export const getFeed = async ({
  dataStoreGetter,
  preferences,
}: {
  dataStoreGetter: DataStoreGetter;
  preferences: UserPreferences;
}): Promise<LegislationFeed> => {
  if (!preferences.location) {
    return {
      fullLegislation: [],
      feed: [],
    };
  }

  const shouldGetChicago = isLocationChicago(preferences.location);
  const shouldGetIllinois =
    shouldGetChicago || isLocationIL(preferences.location);

  const allChicagoBills =
    shouldGetChicago &&
    (await getLegislation(dataStoreGetter, DataStores.Chicago));
  const allILBills =
    shouldGetIllinois &&
    (await getLegislation(dataStoreGetter, DataStores.Illinois));
  const allUSBills = await getLegislation(dataStoreGetter, DataStores.USA);

  let fullLegislation = createFeedBillsFromMultipleSources([
    [allChicagoBills, SupportedLocale.Chicago, [filterNoisyCityBills()]],
    [allILBills, SupportedLocale.Illinois, null],
    [allUSBills, SupportedLocale.USA, null],
  ]);

  fullLegislation = sortByUpdatedAt(uniqBy(fullLegislation, (b) => b.bill.id));
  const feed = sortLegislationByScore(fullLegislation, preferences);

  return {
    fullLegislation,
    feed,
  };
};
