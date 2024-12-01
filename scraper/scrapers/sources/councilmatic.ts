import { isBefore, subDays } from "date-fns";
import { CiviLegislationData } from "@windy-civi/domain";
import { BillQueryResponse, Sponsor, Vote } from "./councilmatic.types";
import {
  getSQLForBillSponsors,
  getSQLForBills,
  getSQLForVoteEvents,
} from "./councilmatic.sql";
import { createFetch } from "./councilmatic.fetch";

const date180DaysAgo = subDays(new Date(), 180);

/**
 * Fetching in chunks because bunkum has API limits.
 * Another thing to note: bunkum will slow down get requests over frequents requests.
 */
const fetchBillsInChunks = async () => {
  const fetchData = createFetch();

  const chunkSize = 130;
  let offset = 0;
  let done = false;
  let totalResults: BillQueryResponse[] = [];

  console.log("Fetching Chicago data in chunks");

  // starting from the first row of the bill table we get 100 results at a time
  while (!done) {
    const data = await fetchData<BillQueryResponse>(
      getSQLForBills(chunkSize, offset)
    );
    const chunk = data.rows;

    totalResults = totalResults.concat(chunk);

    // Fetch sponsors for current chunk
    const sponsorsResultJson = await fetchData<Sponsor>(
      getSQLForBillSponsors(chunk.map((bill) => bill.id))
    );

    const sponsors = sponsorsResultJson.rows;

    // Fetch vote events for current chunk
    const voteEventsResultJson = await fetchData<Vote>(
      getSQLForVoteEvents(chunk.map((bill) => bill.id))
    );
    const votes = voteEventsResultJson.rows;

    // Add sponsors and vote history to each bill
    chunk.forEach((bill) => {
      bill.sponsors = sponsors.filter(
        (sponsor: Sponsor) => sponsor.bill_id === bill.id
      );
      bill.voteHistory = votes.filter((vote: Vote) => vote.bill_id === bill.id);
    });

    offset += chunkSize;

    console.log(
      `Fetched ${chunkSize} bills. Total bills: ${totalResults.length}`
    );

    if (chunk.length < chunkSize) {
      done = true;
    }
  }

  console.log(
    `Done fetching Chicago Bills. Total bills: ${totalResults.length}`
  );

  return totalResults;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getChicagoBills(p: { skipCache: boolean }) {
  console.log("Getting Chicago Bills");
  const billsRes = (await fetchBillsInChunks()) || [];
  const results = billsRes.map((bill) => {
    //can status be set to an array?
    let status = ["Unknown"];
    const actions = JSON.parse(bill.actions);
    const last_action = actions.at(-1);
    const action_date = last_action.date;
    const recentVote = bill.voteHistory[bill.voteHistory.length - 1];
    // setting status as value in voteHistory.motion_classification if there is one
    if (recentVote && recentVote.motion_classification) {
      status = recentVote.motion_classification;
    } else if (isBefore(new Date(action_date), date180DaysAgo)) {
      status = ["Stale"];
    } else if (
      typeof last_action.classification === "string" &&
      last_action.classification.length > 0
    ) {
      status = last_action.classification;
    }

    let classification = "";
    try {
      classification = JSON.parse(bill.classification)[0];
    } catch (e) {
      // We ignore the error
    }

    const bills: CiviLegislationData = {
      id: bill.id,
      title: bill.title,
      tags: JSON.parse(bill.extras).topics,
      status,
      updated_at: action_date,
      statusDate: `${action_date} - ${status}`,
      sponsors: bill.sponsors.map((sponsor) => ({
        name: sponsor.name,
        person_id: sponsor.person_id,
        role: "", // todo
        district: "", // todo
      })),
      voteHistory: bill.voteHistory.map((voteItem) => ({
        motion_classification: voteItem.motion_classification,
        created_at: voteItem.created_at,
      })),
      source_id: "", // todo
      classification,
      identifier: bill.identifier,
      link: `https://chicago.councilmatic.org/legislation/${bill.identifier}`,
      url: `https://chicago.councilmatic.org/legislation/${bill.identifier}`,
      bill_summary: bill.bill_summary,
    };

    return bills;
  });

  return results;
}

export const councilmatic = {
  getChicagoBills,
};
