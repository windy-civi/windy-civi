import { Env } from "../types";
import { getRepresentatives } from "./representatives.google";
import {
  getRepsAndOfficesLocalStorage,
  saveRepsAndOfficesLocalStorage,
} from "./representatives.localstorage";
import { RepresentativesResult } from "./representatives.types";

export const getRepresentativesWithCache = async (
  env: Env,
  address: string
): Promise<RepresentativesResult["offices"] | null> => {
  try {
    const local = getRepsAndOfficesLocalStorage();
    if (local) {
      console.log("using local storage for rep offices");
      return local;
    }
  } catch {
    console.log("local rep data unavailable. using google.");
  }

  // Get representatives from Google
  const representatives = address
    ? await getRepresentatives(address, env)
    : null;

  if (representatives) {
    saveRepsAndOfficesLocalStorage(representatives.offices);
    return representatives.offices;
  }
  return null;
};
