import { Env } from "../types";
import type { GoogleRepresentativesResponse } from "./google.types";
import { transformGoogleCivicInfo } from "./representatives.utils";

export const getRepresentatives = async (address: string, env: Env) => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("key", env.GOOGLE_API_KEY);
    searchParams.set("address", address);
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?${searchParams.toString()}`;
    console.log("searching for representatives for", address);
    const results = await fetch(url).then(
      (r) => r.json() as Promise<GoogleRepresentativesResponse>
    );
    return transformGoogleCivicInfo(results);
  } catch (e) {
    return Promise.reject(e);
  }
};

// export const getRepresentatives = async (address: string, env: Env) => {
//   try {
//     console.log("searching for representatives for", address);
//     const results = await axios.get<GoogleRepresentativesResponse>(
//       `https://www.googleapis.com/civicinfo/v2/representatives`,
//       { params: { key: env.GOOGLE_API_KEY, address } }
//     );

//     return transformGoogleCivicInfo(results.data);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// };

// export const getChicagoWard = async (id: string, env: Env) => {
//   try {
//     console.log("searching for ward by id", id);
//     // https://github.com/opencivicdata/ocd-division-ids/blob/master/identifiers/country-us/state-il-local_gov.csv
//     const results = await axios.get<GoogleRepresentativesResponse>(
//       `https://www.googleapis.com/civicinfo/v2/representatives/ocd-division%2Fcountry%3Aus%2Fstate%3Ail%2Fplace%3Achicago%2Fward%3A${id}`,
//       { params: { key: env.GOOGLE_API_KEY } }
//     );

//     return results.data;
//   } catch (e) {
//     return Promise.reject(e);
//   }
// };
