import axios from "axios";
import { CiviLegislationData, Locales } from "../../../domain";
import { getLegiscanAPIKey } from "../../config/env";
import { cache } from "../../storage/get-cache";
import {
  GetBillByIdResponse,
  GetSessionResult,
  LegiscanBillById,
  LegiscanMasterListBill,
  LegiscanMasterListResult,
} from "./legiscan.types";

type LegiscanLocales = Exclude<Locales, "chicago">;

const getMasterList = async (
  sessionId: string
): Promise<LegiscanMasterListBill[]> => {
  const LEGISCAN_API_KEY = getLegiscanAPIKey();
  console.log("Get Master List", sessionId);
  try {
    const results = await axios.get<LegiscanMasterListResult>(
      `https://api.legiscan.com/?op=getMasterList&id=${sessionId}&key=${LEGISCAN_API_KEY}`
    );

    // all results are a numbered string, except the "session" key
    delete results.data.masterlist.session;
    const bills = Object.values(
      results.data.masterlist
    ) as LegiscanMasterListBill[];

    return bills;
  } catch (e) {
    return Promise.reject(e);
  }
};

const getBillDetailsFromMasterList = async (
  masterList: LegiscanMasterListBill[]
) => {
  console.log("Get Bill Details From MasterList");
  try {
    const results = await Promise.all(
      masterList.map((bill) => legiscan.getBillById(String(bill.bill_id)))
    );
    return results;
  } catch (e) {
    return Promise.reject(e);
  }
};

const getBillById = async (id: string): Promise<LegiscanBillById> => {
  const LEGISCAN_API_KEY = getLegiscanAPIKey();
  console.log("Get Bill By ID:", id);
  try {
    const results = await axios.get<GetBillByIdResponse>(
      `https://api.legiscan.com/?op=getBill&id=${id}&key=${LEGISCAN_API_KEY}`
    );
    return results.data.bill;
  } catch (e) {
    return Promise.reject(e);
  }
};

const getLatestSessionId = async (locale: LegiscanLocales): Promise<string> => {
  const LEGISCAN_API_KEY = getLegiscanAPIKey();
  console.log("Get Session IDs for locale", locale);
  const stateLocaleMap: Record<LegiscanLocales, string> = {
    usa: "US",
    illinois: "IL",
  };
  const state = stateLocaleMap[locale];
  try {
    const results = await axios.get<GetSessionResult>(
      `https://api.legiscan.com/?op=getSessionList&state=${state}&key=${LEGISCAN_API_KEY}`
    );
    const id = results.data.sessions[0].session_id;
    if (!id) {
      Promise.reject("session id not found");
    }
    return String(id);
  } catch (e) {
    return Promise.reject(e);
  }
};

export type FilterMasterListFn = (
  bills: LegiscanMasterListBill[]
) => LegiscanMasterListBill[];

export type LegiscanToCiviMapFn = (
  bill: LegiscanBillById
) => CiviLegislationData;

export const getCiviLegislationBills = async ({
  skipCache,
  filterMasterList,
  legiscanToCivi,
  locale,
}: {
  skipCache: boolean;
  filterMasterList: FilterMasterListFn;
  legiscanToCivi: LegiscanToCiviMapFn;
  locale: LegiscanLocales;
}): Promise<CiviLegislationData[]> => {
  const logPrefix = `GetBills_${locale}:`;
  console.info(logPrefix, "getting bills");

  try {
    const sessionId = await getLatestSessionId(locale);

    // Get Master List
    const bills = await legiscan.getMasterList(sessionId);
    const masterListFiltered = filterMasterList(bills);

    let cachedLegislation: CiviLegislationData[];
    if (skipCache) {
      cachedLegislation = [];
    } else {
      cachedLegislation = await cache.getLegislation(locale);
    }

    const civiLegislationData: CiviLegislationData[] = [];

    // Loop through the current master list
    for (const masterListBill of masterListFiltered) {
      // See if previous data has it
      const cachedBill = cachedLegislation.find(
        (b) => b.id === masterListBill.number
      );
      // Check if the status dates match
      if (cachedBill?.statusDate === masterListBill.status_date) {
        console.info(
          logPrefix,
          "using cached data for bill",
          masterListBill.number
        );
        civiLegislationData.push(cachedBill);
      } else {
        // If they don't, hit legiscan again to get the bill details
        const billDetails = await legiscan.getBillById(
          String(masterListBill.bill_id)
        );
        const newDataBill = legiscanToCivi(billDetails);
        civiLegislationData.push(newDataBill);
      }
    }

    return civiLegislationData;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const legiscan = {
  getMasterList,
  getBillById,
  getBillDetailsFromMasterList,
};
