import { DataStores, RepLevel, SupportedLocale } from "../constants";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  DataStoreGetter,
  LegislationFeed,
  LegislationResult,
  UserPreferences,
} from "../types";
import { sortLegislationByScore } from "./scoring";
import {
  createFeedBillsFromMultipleSources,
  filterNoisyCityBills,
  sortByUpdatedAt,
} from "./selectors";
import { isLocationChicago, isLocationIL, uniqBy } from "./utils";

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
