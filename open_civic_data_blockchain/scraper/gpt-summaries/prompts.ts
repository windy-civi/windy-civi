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
    `Here's a prompt for generating task-oriented legislation summaries:

"For each piece of legislation data, create a task-oriented summary with exactly two lines. Line 1 being the 'headline' and Line 2 being the 'subtitle'.

The 'headline' should be a single sentence framed as a task / action statement that clearly communicates what the legislation aims to accomplish. Use active verbs and direct language that emphasizes the primary objective or mission.

The 'subtitle' should be 1-2 sentences providing concrete details from the legislation data, including the political backing (bipartisan, Republican-led, or Democrat-led) as a natural part of the text.

Focus only on information explicitly provided in the legislation data while ensuring the headline clearly communicates the primary goal as a task statement.

Examples of proper response format would be a new line to separate the headline and subtitle:

Example 1:
Expand Rural Broadband Access and Support Agricultural Communities
The bipartisan bill allocates $2 billion toward high-speed internet infrastructure in under served farming regions. Implementation would begin in January 2026 targeting 1,500 rural counties.

Example 2:
Protect U.S. Personnel from International Criminal Court Jurisdiction
This Republican-led legislation establishes legal safeguards and response mechanisms against potential ICC prosecution of American service members. The bill passed committee with a 12-8 vote and moves to the Senate floor next month.

=== START LEGISLATION DATA ===

${text}

=== END LEGISLATION DATA ===`
  );
  if (!res) {
    return null;
  }
  return res.trim();
};
