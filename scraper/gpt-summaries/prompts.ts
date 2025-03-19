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
For each piece of legislation data, create a 2-3 sentence summary where the first sentence serves as an eye-catching, slightly provocative headline that still conveys the essence of the legislation. The headline should use more colorful language, dynamic verbs, and attention-grabbing phrasing while still communicating the core purpose.
Follow this with 1-2 sentences that provide the concrete details present in the legislation data. Integrate the political backing (bipartisan, Republican-led, or Democrat-led) naturally into one of these sentences. The supporting sentences should be more measured while still maintaining reader interest.
Examples of effective sensationalist headlines:

'Farm Bill Showdown: Rural Broadband Gets Massive Boost in 11th Hour Deal'
'Crumbling No More: Bridge Repair Bonanza Unleashed in Infrastructure Package'
'Republicans Draw Battle Lines with ICC in Bold Protection Move for U.S. Personnel'
'Climate Crisis Confronted: Ambitious New Bill Slashes Emissions in Half'
'Tech Giants Under Fire as Democrats Target Data Harvesting Practices'
'Military Paychecks Get Supersized in Latest Defense Spending Spree'

While making headlines more engaging, ensure the substantive information remains accurate and complete. Avoid fabricating details or misrepresenting the legislation's actual content.
=== START LEGISLATION DATA ===

${text}

=== END LEGISLATION DATA ===`
  );
  if (!res) {
    return null;
  }
  return res.trim();
};
