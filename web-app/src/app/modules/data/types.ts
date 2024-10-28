import { FilteredLegislationData } from "./legislation";
import { OfficialOffice } from "./representatives/representatives.types";

export type FeedData = {
  fullLegislation: WindyCiviBill[];
  filteredLegislation: WindyCiviBill[];
  offices: OfficialOffice[] | null;
};

export interface WindyCiviBill extends FilteredLegislationData {
  // String that is the name of the rep that sponsored the bill
  // note: this should become a OfficialOffice object
  sponsoredByRep?: string | false;
}
