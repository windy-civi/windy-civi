import type { GoogleRepresentativesResponse } from "@windycivi/domain/representatives/google.types";
import { transformGoogleCivicInfo } from "@windycivi/domain/representatives/representatives.utils";
import { Env } from "@windycivi/domain/types";
import axios from "axios";

export const getRepresentatives = async (address: string, env: Env) => {
  try {
    console.log("searching for representatives for", address);
    const results = await axios.get<GoogleRepresentativesResponse>(
      `https://www.googleapis.com/civicinfo/v2/representatives`,
      { params: { key: env.GOOGLE_API_KEY, address } }
    );

    return transformGoogleCivicInfo(results.data);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getChicagoWard = async (id: string, env: Env) => {
  try {
    console.log("searching for ward by id", id);
    // https://github.com/opencivicdata/ocd-division-ids/blob/master/identifiers/country-us/state-il-local_gov.csv
    const results = await axios.get<GoogleRepresentativesResponse>(
      `https://www.googleapis.com/civicinfo/v2/representatives/ocd-division%2Fcountry%3Aus%2Fstate%3Ail%2Fplace%3Achicago%2Fward%3A${id}`,
      { params: { key: env.GOOGLE_API_KEY } }
    );

    return results.data;
  } catch (e) {
    return Promise.reject(e);
  }
};
