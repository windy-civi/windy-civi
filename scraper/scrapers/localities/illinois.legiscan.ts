import { CiviLegislationData } from "../../../api/types";
import { getCiviLegislationBills } from "../sources/legiscan";
import { filterMasterList, legiscanToCivi } from "./illinois.selector";

export const getBills = async ({
  skipCache,
}: {
  skipCache: boolean;
}): Promise<CiviLegislationData[]> => {
  return getCiviLegislationBills({
    skipCache,
    locale: "illinois",
    filterMasterList,
    legiscanToCivi,
  });
};
