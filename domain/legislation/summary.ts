import { WindyCiviBill } from ".";

/**
 * Extracts the headline and summary details from a GPT summary that follows the format:
 * 'Headline' - Rest of the summary
 * or
 * 'Headline'
 *
 * @param summary The GPT summary string to extract the headline and details from
 * @returns Object containing the headline and summary details if found, or null if invalid format
 */
export const extractHeadlineFromSummary = (
  gpt?: WindyCiviBill["gpt"] | null
): { headline: string | null; details: string | null } => {
  if (!gpt) return { headline: null, details: null };

  if (gpt.gpt_title && gpt.gpt_subtitle) {
    return { headline: gpt.gpt_title, details: gpt.gpt_subtitle };
  }

  // Old format. May be removed in the future.
  const summary = gpt.gpt_summary || "";
  // Check if the summary starts with a single quote
  if (!summary.startsWith("'")) return { headline: null, details: null };

  // Find the end of the headline (either a closing quote followed by " - " or just a closing quote)
  const headlineEndWithDetails = summary.indexOf("' - ");
  const headlineEnd = summary.indexOf("'", 1); // Start searching after first quote

  if (headlineEnd === -1) return { headline: null, details: null };

  // Extract the headline (remove the opening and closing quotes)
  const headline = summary.substring(1, headlineEnd);

  // Extract details if they exist (after " - ")
  const details =
    headlineEndWithDetails !== -1
      ? summary.substring(headlineEndWithDetails + 4)
      : null;

  return { headline, details };
};
