import { CiviWikiLegislationData } from "@windycivi/domain/types";
import axios, { AxiosError } from "axios";
import { getGoogleSheetAPIKey } from "../config/env";
import { writeJSON } from "../fs/write-file";
import { SHEET, SPREADSHEET_ID } from "./constants";

type StringKeysOfCiviGoogleSheet = keyof Omit<CiviWikiLegislationData, "tags">;

// The object will have `chicago`, `illinois`, or `usa`, and the value will be CiviWikiLegislationData
type ParsedWikiGoogleSheet = {
  [locale: string]: CiviWikiLegislationData[];
};

/**
 * # csvToJson
 *  Converts the CSV to a JSON
 *
 * ```ts
 * csvToJson([["COLUMN 1", "COLUMN 2"], ["Value For Column 1", "Value For Column 2"], ...])
 * ```
 */
const csvToJson = (csvArray: Array<string[]>) => {
  const headers = csvArray[0];
  const result = [];

  for (let i = 1; i < csvArray.length; i++) {
    const obj: { [k: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = csvArray[i][j];
    }
    result.push(obj);
  }
  return result;
};

const isAxiosError = (e: unknown): e is AxiosError => {
  return typeof e === "object" && e !== null && "response" in e;
};

const handleAxiosError = (e: unknown) => {
  console.log("error happened, but exiting gracefully");
  if (isAxiosError(e)) {
    console.log(e?.response?.status, e?.response?.statusText);
  } else {
    console.log(e);
  }
  process.exit(0);
};

/**
 * # parseCiviGoogleSheetJson
 * Takes the parsed CSV, and makes it ParsedWikiGoogleSheet
 */
const parseCiviGoogleSheetJson = (
  // The CSV converted to JSON
  json: { [k: string]: string }[]
): ParsedWikiGoogleSheet => {
  const localeDataMap: ParsedWikiGoogleSheet = {};
  json.forEach((item) => {
    const wikiObj: CiviWikiLegislationData = {
      bill_id: "",
      summary: "",
      locale: "",
      date: "",
      tags: [],
    };

    // For any column we want to just make it a key, expect for columns that start with the word "Tag "
    // The behavior expected on the Google Sheet is that any column that begins with the word "Tag" is a tag.
    // Example: "Tag Civil Rights"
    Object.entries(item).forEach(([key, value]) => {
      if (key.startsWith("Tag")) {
        if (value !== undefined) {
          // Add those tags as an array of strings
          wikiObj.tags = [...wikiObj.tags, key.replace("Tag ", "")];
        }
      } else {
        // Any other thing, make it a key of this object.
        wikiObj[key as StringKeysOfCiviGoogleSheet] = value;
      }
    });

    if (!localeDataMap[wikiObj.locale]) {
      localeDataMap[wikiObj.locale] = [];
    }
    localeDataMap[wikiObj.locale].push(wikiObj);
  });

  return localeDataMap;
};

const runGoogleSheet = async () => {
  try {
    // Your Google Sheets ID and API key
    const spreadsheetId = SPREADSHEET_ID;
    const range = SHEET; // The range of the sheet you want to get
    const apiKey = getGoogleSheetAPIKey();
    // Google Sheets API URL
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const res = await axios.get(url);
    // Converting this C
    const json = csvToJson(res.data.values);
    // All things that are written to JSON should be of type CiviWikiLegislationData.
    const civiGoogleSheet = parseCiviGoogleSheetJson(json);
    // Append data from the previous file
    Object.entries(civiGoogleSheet).forEach(([locale, data]) => {
      const fileName = `${locale}.legislation.wiki`;
      writeJSON(fileName, data);
    });
  } catch (e: unknown) {
    handleAxiosError(e);
  }
};

runGoogleSheet();
