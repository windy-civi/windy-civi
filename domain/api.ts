import { DataStores, RepLevel, SupportedLocale } from "./constants";
import {
  createFeedBillsFromMultipleSources,
  filterNoisyCityBills,
  selectBillsFromFilters,
  sortByUpdatedAt,
} from "./filters/filters.selectors";
import {
  getAddress,
  hasSponsoredByRepTag,
  isLocationChicago,
  isLocationIL,
} from "./filters/filters.utils";
import { getRepresentatives } from "./representatives/google";
import {
  CiviGptLegislationData,
  CiviLegislationData,
  DataStoreGetter,
  Env,
  FeedData,
  FilterParams,
  LegislationResult,
} from "./types";

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
  env,
}: {
  dataStoreGetter: DataStoreGetter;
  filters: FilterParams;
  env: Env;
}): Promise<FeedData> => {
  // Must set location to get data
  if (!filters.location) {
    return {
      fullLegislation: [],
      filteredLegislation: [],
      offices: null,
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

  const { representatives, offices } = await getRepsAndOffices(
    env,
    filters.location
  );

  const showSponsoredBills = Boolean(
    representatives && hasSponsoredByRepTag(filters.tags)
  );

  // First select all bills that are sponsored, if the user wants sponsored bills
  const fullLegislation = createFeedBillsFromMultipleSources(representatives, [
    [
      allChicagoBills,
      RepLevel.City,
      [filterNoisyCityBills(showSponsoredBills)],
    ],
    [allILBills, RepLevel.State, null],
    [allUSBills, RepLevel.National, null],
  ]);

  // Then select and filter bills based on user filters
  let filteredLegislation = selectBillsFromFilters(fullLegislation, filters);

  // Sort by updated_at
  filteredLegislation = sortByUpdatedAt(filteredLegislation);

  return {
    fullLegislation,
    filteredLegislation,
    offices,
  };
};

export const getRepsAndOffices = async (
  env: Env,
  location: FilterParams["location"]
) => {
  // Get representatives
  const address = getAddress(location);
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  // Get a list of all representative offices
  const offices = representatives
    ? [
        ...representatives.offices.city,
        ...representatives.offices.county,
        ...representatives.offices.state,
        ...representatives.offices.national,
      ]
    : null;
  return { representatives, offices };
};
