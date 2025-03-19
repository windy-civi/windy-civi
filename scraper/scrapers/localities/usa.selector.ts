import { FilterMasterListFn, LegiscanToCiviMapFn } from "../sources/legiscan";
import { STATUS_MAP } from "../sources/legiscan.types";
import { legiscanFederalRepDistrictToOcd } from "../sources/legiscan.utils";

export const filterMasterList: FilterMasterListFn = (bills) => {
  return (
    bills
      // only show bills that are passed introduction stage
      .filter((bill) => bill.status > 1)
  );
};

export const legiscanToCivi: LegiscanToCiviMapFn = (bill) => {
  return {
    id: bill.bill_number,
    title: bill.title,
    description: bill.description,
    status: [STATUS_MAP[bill.status]],
    statusDate: bill.status_date,
    sponsors: bill.sponsors.map((sponsor) => ({
      name: sponsor.name,
      role: sponsor.role,
      district: legiscanFederalRepDistrictToOcd(sponsor.district),
    })),
    link: bill.state_link,
    source_id: String(bill.bill_id),
  };
};
