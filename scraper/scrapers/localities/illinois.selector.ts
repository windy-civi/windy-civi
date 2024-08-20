import { FilterMasterListFn, LegiscanToCiviMapFn } from "../sources/legiscan";
import { STATUS_MAP } from "../sources/legiscan.types";
import { legiscanStateRepDistrictToOcd } from "../sources/legiscan.utils";

/**
 * Illinois bills have either SB0000, HB0000, HJR0000, or SJR0000.
 * Get the number from the last 4
 */
const getNumberFromBill = (s: string): number =>
  Number(s.substring(s.length - 4));

/**
 * Converts the Legiscan master list to data that can be rendered by the UI
 */
export const filterMasterList: FilterMasterListFn = (bills) => {
  return (
    bills
      // for now, only get legislation data that is related to creating or amending bills
      .filter((bill) => {
        const firstSentence = bill.description.split(".")[0];
        return (
          firstSentence.includes("Creates the ") ||
          firstSentence.includes("Amends the ")
        );
      })
      // Ignore budget bills for now. They are pretty complicated.
      .filter((bill) => bill.title !== "BUDGET IMPLEMENTATION-TECH")
      // don't include task forces
      .filter((bill) => !bill.number.includes("HJR"))
      .filter((bill) => !bill.number.includes("SJR"))
      // ignore unfinished bills
      .filter(
        (bill) =>
          !bill.description.includes("Contains only a short title provision.")
      )
      // only get first 50 bills from senate or house
      .filter((bill) => getNumberFromBill(bill.number) < 50)
      // ignore code changes for now
      .filter((bill) => !bill.description.split(".")[0].includes("Code"))
      // ignore technical changes
      .filter(
        (bill) =>
          !bill.description.split(".")[1].includes("Makes a technical change")
      )
      .sort((a, b) =>
        getNumberFromBill(a.number) > getNumberFromBill(b.number) ? 1 : -1
      )
  );
};

export const legiscanToCivi: LegiscanToCiviMapFn = (bill) => {
  const title = bill.description
    .split(".")[0]
    .replace("Creates the ", "")
    .replace("Amends the ", "Amend the ");

  const description = bill.description.split(".").slice(1, 3).join(".") + ".";

  return {
    id: bill.bill_number,
    title,
    description,
    status: [STATUS_MAP[bill.status]] || [],
    statusDate: bill.status_date,
    // only get first two sentences
    sponsors: bill.sponsors.map((sponsor) => ({
      name: sponsor.name,
      role: sponsor.role,
      district: legiscanStateRepDistrictToOcd("il", sponsor.district),
    })),
    link: bill.state_link,
    source_id: String(bill.bill_id),
  };
};
