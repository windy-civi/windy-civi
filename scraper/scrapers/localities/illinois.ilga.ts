import axios from 'axios';
import * as cheerio from 'cheerio';
import { CiviLegislationData } from '../../api/types'

// A range of bills and corresponding URL for more information
interface BillRange {
  url: string;
  range: string;
}

const getFilteredBillRanges = ($: cheerio.CheerioAPI, anchorElements: cheerio.Cheerio<cheerio.Element>,filterText: string): {href: string, text: string}[] => {
  const $filteredAnchors = anchorElements.filter((_, element) => {
    const href = $(element).attr('href') || '';
    // Example filter: only include hrefs that contain '/legislation/'
    return href.includes(filterText);
    });

    // Extract relevant information from filtered anchors
    const filteredBillRanges = $filteredAnchors.map((_, element) => {
      const $element = $(element);
      return {
        href: $element.attr('href') || '',
        text: $element.text().trim(),
      };
    }).get(); // Use `.get()` to convert Cheerio object to a plain array}

    return filteredBillRanges;
}

const getBillRanges = async (): Promise<BillRange[]> => {
  try {
    // Fetch the webpage content
    const { data } = await axios.get('https://www.ilga.gov/legislation/');

    // Load the webpage content into cheerio
    const $ = cheerio.load(data);

    // Array to hold the bill ranges
    const billRanges: BillRange[] = [];

    // Select all anchor elements
    const $anchors = $('a');

    // Get the Senate Bill Ranges
    const senateBillRanges = getFilteredBillRanges($, $anchors, "SB&GA");

    // Get the House Bill Ranges
    const houseBillRanges = getFilteredBillRanges($, $anchors, "HB&GA");

    const allBillRangeObjects = [...senateBillRanges, ...houseBillRanges]

    allBillRangeObjects.forEach(range => {
      billRanges.push({
        url: range.href,
        range: range.text
      });
    });
    return billRanges;
  }
  catch(error) {
    console.error('Error scraping bills:', error);
    return [];
  }
}

// Function to scrape the bills
export const scrapeILBills = async (): Promise<BillRange[]> => {
  //get senate and house bill ranges
  let billRanges: BillRange[] = []
  getBillRanges().then(ranges => {
    console.log('Bill Ranges:', ranges);
    billRanges = ranges;
  }).catch(console.error);

  //TODO: For each range, get the list of bills

  //TODO: For each bill, collect the CiviLegislationData. Update this method to return that array.
  return billRanges;
}

scrapeILBills();