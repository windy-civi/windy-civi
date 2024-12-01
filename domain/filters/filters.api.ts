import { uniqBy } from "lodash";

import { DataStores, RepLevel, SupportedLocale } from "../constants";
import {
  createFeedBillsFromMultipleSources,
  filterNoisyCityBills,
  selectBillsFromFilters,
  sortByUpdatedAt,
} from "./filters.selectors";
import {
  hasSponsoredByRepTag,
  isLocationChicago,
  isLocationIL,
} from "./filters.utils";
import { RepresentativesResult } from "../representatives/representatives.types";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  DataStoreGetter,
  FilterParams,
  LegislationFeed,
  LegislationResult,
} from "../types";

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

export const getFilteredLegislation = async ({
  dataStoreGetter,
  filters,
  representatives,
}: {
  dataStoreGetter: DataStoreGetter;
  filters: FilterParams;
  representatives: RepresentativesResult["offices"] | null;
}): Promise<LegislationFeed> => {
  // Must set location to get data
  if (!filters.location) {
    return {
      fullLegislation: [],
      filteredLegislation: [],
    };
  }
  // Check which bills to retrieve
  // todo: put this in a generic map to allow for extensibility
  const shouldGetChicago = isLocationChicago(filters.location);
  const shouldGetIllinois = shouldGetChicago || isLocationIL(filters.location);

  // Get all bills from all the network
  const allChicagoBills =
    shouldGetChicago &&
    (await getLegislation(dataStoreGetter, DataStores.Chicago));
  const allILBills =
    shouldGetIllinois &&
    (await getLegislation(dataStoreGetter, DataStores.Illinois));
  const allUSBills = await getLegislation(dataStoreGetter, DataStores.USA);

  const showSponsoredBills = Boolean(
    representatives && hasSponsoredByRepTag(filters.tags)
  );

  // First select all bills that are sponsored, if the user wants sponsored bills
  let fullLegislation = createFeedBillsFromMultipleSources(representatives, [
    [
      allChicagoBills,
      RepLevel.City,
      [filterNoisyCityBills(showSponsoredBills)],
    ],
    [allILBills, RepLevel.State, null],
    [allUSBills, RepLevel.National, null],
  ]);

  // Remove duplicates
  // TODO: should move to scraper
  fullLegislation = uniqBy(fullLegislation, (b) => b.bill.id);

  // Then select and filter bills based on user filters
  let filteredLegislation = selectBillsFromFilters(fullLegislation, filters);

  // Sort by updated_at
  filteredLegislation = sortByUpdatedAt(filteredLegislation);

  return {
    fullLegislation,
    filteredLegislation,
  };
};
