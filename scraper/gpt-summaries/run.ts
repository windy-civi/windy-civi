import { forEachLocale } from "@windy-civi/domain/filters/filters.utils";
import { CiviGptLegislationData, Locales } from "@windy-civi/domain/types";
import { storage } from "@windy-civi/storage";
import { getCacheDir, getLocale, getShouldSkipCache } from "../config/env";
import { categorizeText, summarizeText } from "./prompts";

const generateGptSummaries = async (locale: Locales, billId?: string) => {
  const cacheDir = getCacheDir();
  const cachedGpt = await storage.preferLocal.getGpt(locale, cacheDir);
  let legislations = await storage.preferLocal.getLegislation(locale, cacheDir);

  // To run on a single bill
  if (billId) {
    legislations = legislations.filter((bill) => bill.id === billId);
    if (legislations.length === 0) {
      throw new Error("legislation not found");
    }
  }

  // JSON to save
  const legislationWithAi = {} as CiviGptLegislationData;

  let skippedBillCount = 0;

  for (const legislation of legislations) {
    // We only want to summarize resolutions for now, as there are a lot of other bills
    // that would make this expensive from an OPEN AI perspective, and also
    // a lot of these bills don't need summaries
    const isNotResolution =
      locale === "chicago" && legislation.classification !== "resolution";

    if (isNotResolution) {
      skippedBillCount++;
      legislationWithAi[legislation.id] = {
        gpt_summary: "",
        gpt_tags: [],
      };
      continue;
    }

    console.log("\n\n\n");
    console.log("summarizing legislation", legislation.id, legislation.title);

    const shouldSkipCache = getShouldSkipCache();
    const cachedSummary = cachedGpt[legislation.id]?.gpt_summary;
    const cachedTags = cachedGpt[legislation.id]?.gpt_tags;
    const cachedTagsExist = Array.isArray(cachedTags) && cachedTags.length > 0;

    // generate summaries
    if (!shouldSkipCache && cachedSummary) {
      console.log("using cached summarization");
      legislationWithAi[legislation.id] = {
        ...(legislationWithAi[legislation.id] || {}),
        gpt_summary: cachedSummary,
      };
    } else {
      let gpt_summary: string | null;
      // check if a summary already exists from the source data.
      if (legislation.bill_summary) {
        console.log("summary already exists on retrieved bill. using that.");
        gpt_summary = legislation.bill_summary;
      }
      // Otherwise, use OpenAI here to summarize the bill.
      else {
        // pass a combo of the title and the description to open ai.
        const text = legislation.title + "\n" + legislation.description;
        gpt_summary = await summarizeText(text);
      }
      // If there isn't a summary even after all this, run edge cases.
      if (!gpt_summary) {
        // See if we have a previously cached summary
        if (cachedSummary) {
          gpt_summary = cachedSummary;
          console.log("could not get get summary. using cache");
        }
        // Otherwise, no summary, and have a log
        else {
          gpt_summary = "";
          console.log("could not get get summary or cache.");
        }
      }

      console.log("summarized", gpt_summary);

      // Add gpt summary
      legislationWithAi[legislation.id] = {
        ...(legislationWithAi[legislation.id] || {}),
        gpt_summary,
      };
    }

    // generate tags
    if (!shouldSkipCache && cachedTagsExist) {
      console.log("using cached tags");
      legislationWithAi[legislation.id] = {
        ...(legislationWithAi[legislation.id] || {}),
        gpt_tags: cachedGpt[legislation.id]?.gpt_tags || [],
      };
    } else {
      // pass a combo of the title and the description to open ai.
      const text = legislation.title + "\n" + legislation.description;

      console.log("tagging legislation");

      let gpt_tags = await categorizeText(text.trim());

      if (!gpt_tags) {
        if (cachedTagsExist) {
          gpt_tags = cachedTags;
          console.log("could not get get summary. using cache");
        } else {
          gpt_tags = [];
          console.log("could not get get summary or cache.");
        }
      }

      console.log(gpt_tags);

      // Add gpt summary
      legislationWithAi[legislation.id] = {
        ...(legislationWithAi[legislation.id] || {}),
        gpt_tags,
      };
    }
  }

  if (skippedBillCount > 0) {
    console.log(
      `Skipped running gpt on ${skippedBillCount} local ordinances to save on API costs.`
    );
  }

  storage.fs.saveGpt(locale, cacheDir, legislationWithAi);
};

const runGpt = async () => {
  try {
    const localeFromEnv = getLocale();
    forEachLocale(async (locale) => {
      console.info("running gpt for locale:", locale);
      await generateGptSummaries(locale);
    }, localeFromEnv);
  } catch (e) {
    console.log("error happened, but exiting gracefully");
    console.log(e);
    process.exit(0);
  }
};

runGpt();
