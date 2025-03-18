import {
  AllAllowedTags,
  ALLOWED_TAGS,
  CustomChicagoTag,
  DEFAULT_TAG_PREFERENCES,
} from "../tags";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  getBillUpdateAt,
  LegislationFeed,
  LegislationResult,
  WindyCiviBill,
} from "../legislation";
import { UserPreferences } from "../user-preferences";
import {
  DataStores,
  isLocationChicago,
  isLocationIL,
  RepLevel,
  SupportedLocale,
} from "../locales";
import { DataStoreGetter } from "../drivers";
import { findStringOverlap, uniqBy } from "../scalars";

// Helper function to create the API for getting legislation
// This is to decouple the actual data store from the domain logic, making it easier to test
// and separate the "brain" of the codebase from the rest. See https://en.wikipedia.org/wiki/Domain-driven_design
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

export const getFeed = async ({
  dataStoreGetter,
  preferences,
}: {
  dataStoreGetter: DataStoreGetter;
  preferences: UserPreferences;
}): Promise<LegislationFeed> => {
  // Must set location to get data
  if (!preferences.location) {
    return {
      fullLegislation: [],
      feed: [],
    };
  }
  // Check which bills to retrieve
  // todo: put this in a generic map to allow for extensibility
  const shouldGetChicago = isLocationChicago(preferences.location);
  const shouldGetIllinois =
    shouldGetChicago || isLocationIL(preferences.location);

  // Get all bills from all the network
  const allChicagoBills =
    shouldGetChicago &&
    (await getLegislation(dataStoreGetter, DataStores.Chicago));
  const allILBills =
    shouldGetIllinois &&
    (await getLegislation(dataStoreGetter, DataStores.Illinois));
  const allUSBills = await getLegislation(dataStoreGetter, DataStores.USA);

  // Select all bills
  let fullLegislation = createFeedBillsFromMultipleSources([
    [allChicagoBills, RepLevel.City, [filterNoisyCityBills()]],
    [allILBills, RepLevel.State, null],
    [allUSBills, RepLevel.National, null],
  ]);

  // Remove duplicates
  // TODO: should move to scraper
  fullLegislation = sortByUpdatedAt(uniqBy(fullLegislation, (b) => b.bill.id));

  // Sort by score
  const feed = sortLegislationByScore(fullLegislation, preferences);

  return {
    fullLegislation,
    feed,
  };
};

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
    gptTags = findStringOverlap(gptTags, ALLOWED_TAGS);

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

// Tag priority mapping - higher number means higher priority

// Level priorities - higher number means higher priority
const LEVEL_PRIORITIES: Record<RepLevel, number> = {
  [RepLevel.National]: 4,
  [RepLevel.State]: 3,
  [RepLevel.City]: 2,
  [RepLevel.County]: 1, // technically we dont even have county data
};

// Scoring weights for different factors
const SCORING_WEIGHTS = {
  tags: 0.6, // 60% weight for tag relevance
  freshness: 0.3, // 30% weight for how recent the bill is
  level: 0.1, // 10% weight for government level
};

const calculateTagScore = (
  userTags: UserPreferences["tags"] = DEFAULT_TAG_PREFERENCES,
  itemTags?: AllAllowedTags[]
): number => {
  if (!itemTags || itemTags.length === 0) return 0;

  // Find overlap between user tags and item tags
  const matchedTags = userTags.filter((tag) => itemTags.includes(tag));
  const overlapBooster = matchedTags.length * 3;

  // Normalize to 0-1 range (assuming max possible score is the length of allowed tags)
  return Math.min(overlapBooster / ALLOWED_TAGS.length, 1);
};

const calculateFreshnessScore = (item: WindyCiviBill): number => {
  const updateDate = getBillUpdateAt(item);
  const now = new Date().getTime();

  // Convert string date to timestamp
  const updateTimestamp = new Date(updateDate).getTime();
  const ageInDays = (now - updateTimestamp) / (1000 * 60 * 60 * 24);

  // Exponential decay over 30 days
  return Math.exp(-ageInDays / 30);
};

const calculateLevelScore = (level: RepLevel): number => {
  return LEVEL_PRIORITIES[level] / Math.max(...Object.values(LEVEL_PRIORITIES));
};

const calculateTotalScore = (
  preferences: UserPreferences,
  item: WindyCiviBill
): number => {
  const tagScore = calculateTagScore(preferences.tags, item.allTags);
  const freshnessScore = calculateFreshnessScore(item);
  const levelScore = calculateLevelScore(item.level);
  return (
    tagScore * SCORING_WEIGHTS.tags +
    freshnessScore * SCORING_WEIGHTS.freshness +
    levelScore * SCORING_WEIGHTS.level
  );
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
