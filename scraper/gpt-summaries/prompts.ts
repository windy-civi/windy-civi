import { ALLOWED_TAGS } from "@windy-civi/domain/tags";
import { postTextCompletions } from "./openai-api";

export const categorizeText = async (
  text: string
): Promise<string[] | null> => {
  const content = `Categorize this legislation. Give the response with only comma separated answers:

${text}

The only categories you should pick from are: 

${ALLOWED_TAGS.join("\n")}

If no categories match, respond with "Other".
`;

  const summary = await postTextCompletions(content);
  if (!summary) {
    return null;
  }
  const trimmed = summary.trim();
  // gpt seems to sometimes add a period with this prompt. remove it.
  const periodRemoved = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;

  const gpt_tags = periodRemoved.split(",").map((tag) => tag.trim());

  return gpt_tags;
};

export const summarizeText = async (text: string) => {
  const res = await postTextCompletions(
    `
For each piece of legislation data, create a 2-3 sentence summary where the first sentence functions as a newspaper-style headline. The headline should be concise, present-tense, and capture the most newsworthy aspect of the legislation.
If data is available, integrate the political backing (bipartisan, Republican-led, or Democrat-led) into the headline. The entire summary should read like the opening of a news article.
Examples of effective headlines:

'Senate Passes Farm Bill with Expanded Rural Broadband Funding'
'Bipartisan Infrastructure Package Allocates $25 Billion for Bridge Repairs'
'Republican-Led Bill Seeks to Deter ICC from Targeting U.S. Personnel'
'New Climate Legislation Aims to Cut Emissions 50% by 2035'
'Democrat-Sponsored Privacy Act Would Restrict Data Collection by Tech Giants'
'Defense Authorization Increases Military Pay by 3.5% in Coming Fiscal Year'

Avoid speculating on missing information, like if the legislation doesn't seem sponsored, repeating the title unnecessarily, or using stock phrases like 'Bill introduced.' Focus only on information explicitly provided while maintaining a neutral, factual tone throughout.

=== START LEGISLATION DATA ===

${text}

=== END LEGISLATION DATA ===`
  );
  if (!res) {
    return null;
  }
  return res.trim();
};
