import { getAddress } from "../filters/filters.utils";
import { Env, LocationFilter } from "../types";
import { getRepresentatives } from "./representatives.google";
import {
  getRepsAndOfficesLocalStorage,
  saveRepsAndOfficesLocalStorage,
} from "./representatives.localstorage";
import { RepresentativesResult } from "./representatives.types";

export const getRepresentativesWithCache = async (
  env: Env,
  location: LocationFilter
): Promise<RepresentativesResult["offices"] | null> => {
  const local = getRepsAndOfficesLocalStorage();
  if (local) {
    console.log(local);
    return local;
  }

  // Get representatives from Google
  const address = getAddress(location);
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  if (representatives) {
    saveRepsAndOfficesLocalStorage(representatives.offices);
    return representatives.offices;
  }
  return null;
};
