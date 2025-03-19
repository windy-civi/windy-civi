import { CiviLegislationData } from "@windy-civi/domain/legislation";
import { getCiviLegislationBills } from "../sources/legiscan";
import { filterMasterList, legiscanToCivi } from "./illinois.selector";

export const getBills = async ({
  skipCache,
  cacheDir,
}: {
  skipCache: boolean;
  cacheDir: string;
}): Promise<CiviLegislationData[]> => {
  return getCiviLegislationBills({
    skipCache,
    cacheDir,
    locale: "illinois",
    filterMasterList,
    legiscanToCivi,
  });
};
