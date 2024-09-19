import { RepLevel } from "../filters";

// TODO: Move to backend
export const mapToReadableStatus = (
  level: RepLevel,
  status: string
): { name: string; type: "in-progress" | "pass" | "fail" } => {
  switch (level) {
    case RepLevel.City:
      switch (status) {
        case "introduction":
          return { name: "Introduced", type: "in-progress" };
        case "referral-committee":
          return { name: "In Committee", type: "in-progress" };
        case "passage":
          return { name: "Passed", type: "pass" };
        case "substitution":
          return { name: "Substituted", type: "in-progress" };
        case "committee-passage-favorable":
          return { name: "Recommended By Committee", type: "in-progress" };
        default:
          return {
            name: toTitleCase(status.split("-").join(" ")),
            type: "in-progress",
          };
      }
    // @ts-expect-error Ignoring fall through case here
    case RepLevel.State:
      switch (status) {
        case "Pass":
          return { name: "Became Law", type: "pass" };
      }
    // eslint-disable-next-line no-fallthrough
    case RepLevel.National:
      switch (status) {
        case "Engross":
          return { name: "Passed House", type: "in-progress" };
        case "Enroll":
          return {
            name: "Awaiting Presidential Approval",
            type: "in-progress",
          };
        case "Pass":
          return { name: "Became Law", type: "pass" };
      }
  }
  return { name: status, type: "in-progress" };
};

// TODO: We need to clean up the status data on the backend
export const getLastStatus = (status: unknown): string => {
  if (typeof status === "string") {
    try {
      const parsed = JSON.parse(status);
      return parsed[parsed.length - 1];
    } catch (e) {
      return status;
    }
  }
  if (Array.isArray(status)) {
    return status[status.length - 1];
  }
  return "";
};

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};
