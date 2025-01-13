import { RepresentativesResult } from "./representatives.types";

export const getRepsAndOfficesLocalStorage = ():
  | RepresentativesResult["offices"]
  | null => {
  const storageRepresentatives = localStorage.getItem("offices");
  return JSON.parse(storageRepresentatives || "");
};

export const saveRepsAndOfficesLocalStorage = (
  p: RepresentativesResult["offices"]
) => {
  localStorage.setItem("offices", JSON.stringify(p));
};
