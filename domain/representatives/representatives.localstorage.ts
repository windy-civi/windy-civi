import { RepresentativesResult } from "./representatives.types";

export const getRepsAndOfficesLocalStorage = ():
  | RepresentativesResult["offices"]
  | null => {
  try {
    const storageRepresentatives = localStorage.getItem("offices");
    return JSON.parse(storageRepresentatives || "");
  } catch {
    console.log("no locally stored items found");
    return null;
  }
};

export const saveRepsAndOfficesLocalStorage = (
  p: RepresentativesResult["offices"]
) => {
  localStorage.setItem("offices", JSON.stringify(p));
};
