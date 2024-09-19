import { RepLevel } from "../filters/filters.constants";
import { hasOverlap } from "../filters/filters.utils";
import type {
  GoogleRepresentativesResponse,
  Office,
  Official,
} from "./google.types";
import type {
  OfficialOffice,
  RepresentativesResult,
} from "./representatives.types";

export const transformGoogleCivicInfo = (
  data: GoogleRepresentativesResponse
): RepresentativesResult => {
  const offices = data.offices
    .map((office) => {
      return office.officialIndices.map((index) => ({
        official: data.officials[index],
        office,
      }));
    })
    .flat()
    .reverse();

  const response: RepresentativesResult = {
    normalizedInput: data.normalizedInput,
    offices: {
      city: offices.filter((off) => off.office.levels[0] === "locality"),
      county: offices.filter(
        (off) => off.office.levels[0] === "administrativeArea2"
      ),
      state: offices.filter(
        (off) => off.office.levels[0] === "administrativeArea1"
      ),
      national: offices.filter((off) => off.office.levels[0] === "country"),
    },
  };
  return response;
};

export const getLegislators = (
  offices?: OfficialOffice[] | null
): {
  office: Office;
  official: Official;
  title: string;
  name: string;
  link: string;
  level: RepLevel;
}[] => {
  if (!(Array.isArray(offices) && offices.length > 0)) {
    return [];
  }
  return (
    offices
      // Only supporting Illinois at the moment
      .filter((officialOffice) => {
        if (
          officialOffice.office.divisionId.includes("state:") &&
          !officialOffice.office.divisionId.includes("state:il")
        ) {
          return false;
        }
        return true;
      })
      // We don't support county level
      .filter(
        (officialOffice) =>
          !officialOffice.office.divisionId.includes("county:")
      )
      // We only support Chicago city legislation
      .filter((officialOffice) => {
        if (officialOffice.office.divisionId.includes("place:chicago")) {
          return true;
        } else if (officialOffice.office.divisionId.includes("place:")) {
          return false;
        }
        return true;
      })
      .filter((officialOffice) =>
        hasOverlap(officialOffice.office.roles, [
          "legislatorLowerBody",
          "legislatorUpperBody",
        ])
      )
      .map((officialOffice) => {
        // last name attempt
        const name = officialOffice.official.name
          .replace(",", "")
          .replace(".", "")
          .replace("Jr.", "")
          .split(" ")
          .filter((name) => name.length > 1)
          .join(" ");
        return {
          office: officialOffice.office,
          official: officialOffice.official,
          title: officialOffice.office.name,
          name: name,
          link: officialOffice.official.urls?.[0],
          level: officialOffice.office.name.includes("Chicago")
            ? RepLevel.City
            : officialOffice.office.name.includes("IL")
            ? RepLevel.State
            : RepLevel.National,
        };
      })
  );
};
