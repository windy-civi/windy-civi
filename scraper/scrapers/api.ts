import { CiviLegislationData, Locales } from "../api";
import { councilmatic } from "./sources/councilmatic";
import * as il from "./localities/illinois.legiscan";
import * as usa from "./localities/usa.legiscan";

export const api: Record<
  Locales,
  (p: { skipCache: boolean }) => Promise<CiviLegislationData[]>
> = {
  chicago: councilmatic.getChicagoBills,
  illinois: il.getBills,
  usa: usa.getBills,
};
