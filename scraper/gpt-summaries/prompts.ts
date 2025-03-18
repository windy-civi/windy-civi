import { ALLOWED_TAGS } from "@windy-civi/domain/constants";
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
    `Summarize this for an 8th-grade student:\n\n${text}`
  );
  if (!res) {
    return null;
  }
  return res.trim();
};
