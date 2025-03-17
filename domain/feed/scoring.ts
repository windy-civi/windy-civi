// Tag priority mapping - higher number means higher priority

import { RepLevel } from "../constants";
import { WindyCiviBill } from "../types";
import { getBillUpdateAt } from "./utils";

// Leaning pretty liberal for this MVP. todo: make more balanced.
const TAG_PRIORITIES: Record<string, number> = {
  // Highest Priority (5) - Immediate impact on basic rights and safety
  Abortion: 5,
  "Climate Change": 5,

  // High Priority (4) - Essential services and major policy areas
  "Health Care": 4,
  Education: 4,
  Transit: 4,

  // Medium Priority (3) - Important but less immediate impact
  Immigration: 3,
  "Public Safety": 3,
  "Civil Rights": 3,
  Economy: 3,
  Democracy: 3,
  Ordinance: 3,

  // Lower Priority (2) - Procedural and structural issues
  Resolution: 2,
  "States Rights": 2,
  "Foreign Policy": 2,

  // Base Priority (1) - Catchall
  Other: 1,
};

// Level priorities - higher number means higher priority
const LEVEL_PRIORITIES: Record<RepLevel, number> = {
  [RepLevel.National]: 4,
  [RepLevel.State]: 3,
  [RepLevel.City]: 2,
  [RepLevel.County]: 1, // technically we dont even have county data
};

// Scoring weights for different factors
const SCORING_WEIGHTS = {
  tags: 0.4, // 40% weight for tag relevance
  freshness: 0.35, // 35% weight for how recent the bill is
  level: 0.25, // 25% weight for government level
};

const calculateTagScore = (tags: string[] | undefined): number => {
  if (!tags || tags.length === 0) return 0;

  const totalPriority = tags.reduce((priority, tag) => {
    return priority + (TAG_PRIORITIES[tag] || 0);
  }, 0);

  // Normalize to 0-1 range (assuming max possible score is 15)
  return Math.min(totalPriority / 15, 1);
};

const calculateFreshnessScore = (item: WindyCiviBill): number => {
  const updateDate = getBillUpdateAt(item);
  const now = new Date().getTime();

  // Convert string date to timestamp
  const updateTimestamp = new Date(updateDate).getTime();
  const ageInDays = (now - updateTimestamp) / (1000 * 60 * 60 * 24);

  // Exponential decay over 30 days
  return Math.exp(-ageInDays / 30);
};

const calculateLevelScore = (level: RepLevel): number => {
  return LEVEL_PRIORITIES[level] / Math.max(...Object.values(LEVEL_PRIORITIES));
};

const calculateTotalScore = (item: WindyCiviBill): number => {
  const tagScore = calculateTagScore(item.allTags);
  const freshnessScore = calculateFreshnessScore(item);
  const levelScore = calculateLevelScore(item.level);
  return (
    tagScore * SCORING_WEIGHTS.tags +
    freshnessScore * SCORING_WEIGHTS.freshness +
    levelScore * SCORING_WEIGHTS.level
  );
};

export const sortLegislationByScore = (
  legislation: WindyCiviBill[]
): WindyCiviBill[] => {
  console.log(
    "sorting legislation by score",
    legislation.filter((a) => !a.allTags.some((a) => a === "Other"))[0]
  );
  return [...legislation].sort((a, b) => {
    const scoreA = calculateTotalScore(a);
    const scoreB = calculateTotalScore(b);
    return scoreB - scoreA;
  });
};
