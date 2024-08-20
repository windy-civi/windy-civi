import { CouncilmaticResponse } from "./councilmatic.types";

// Datamade and Bunkum Share the same URL params as database
const DB_URL = "https://puddle.datamade.us/chicago_council-dd53412.json?sql=";
const BACKUP_DB_URL =
  "https://puddle.bunkum.us/chicago_council-dd53412.json?sql=";

const createSQLUrl = (sql: string, shouldUseBackup?: boolean) => {
  const url = shouldUseBackup ? BACKUP_DB_URL : DB_URL;
  return `${url}${encodeURIComponent(sql)}`;
};

/**
 * Creates the fetch function to fetch from the database,
 * and uses the backup database if the main one fails.
 */
export const createFetch = () => {
  let useBackup = false;

  const fetchData = async <T extends object>(
    sqlQuery: string
  ): Promise<CouncilmaticResponse<T>> => {
    const [res, err] = await fetchJSONWithRetries<CouncilmaticResponse<T>>(
      createSQLUrl(sqlQuery, useBackup)
    );
    if (err && !useBackup) {
      console.log(
        "Error fetching data from main database. Trying backup database."
      );
      useBackup = true;
      return fetchData<T>(sqlQuery);
    }
    if (err && useBackup) {
      console.error("Error fetching data from backup database.");
      process.exit(1);
    }
    return res as CouncilmaticResponse<T>;
  };

  return fetchData;
};

/**
 * Fetch JSON data with a built in retry mechanism
 * Returns golang style [res, err]
 */
const fetchJSONWithRetries = async <T extends object>(
  url: string
): Promise<[T | null, unknown | null]> => {
  const [res, err] = await asyncWithRetries(async () => {
    const res = await fetch(url);
    try {
      const data = await res.json();
      return data;
    } catch (e) {
      console.error("Error parsing json");
      console.log("ResponseText");
      console.log(await res.text());
      throw e;
    }
  });
  return [res, err];
};

/**
 * Retry with exponential backoff with max wait time of 8 seconds
 * and golang style [res, err] return
 */
const asyncWithRetries = async <T extends any>(
  asyncFunc: () => Promise<T>,
  retries = 3,
  shouldRetry?: (error: unknown) => boolean
): Promise<[T | null, unknown | null]> => {
  try {
    const res = await asyncFunc();
    return [res, null];
  } catch (e: unknown) {
    const sR = shouldRetry ? shouldRetry(e) : true;
    if (sR && retries > 0) {
      const waitTime = Math.pow(2, 4 - retries) * 5000; // Exponential backoff with max wait time of 8 seconds
      console.log(`Failed. retrying in ${waitTime / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return await asyncWithRetries(asyncFunc, retries - 1);
    } else {
      throw e;
    }
  }
};
