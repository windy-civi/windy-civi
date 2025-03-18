// Tag priority mapping - higher number means higher priority

import {
  AllAllowedTags,
  ALLOWED_TAGS,
  DEFAULT_TAG_PREFERENCES,
  RepLevel,
} from "../constants";
import { UserPreferences, WindyCiviBill } from "../types";
import { getBillUpdateAt } from "./utils";

// Level priorities - higher number means higher priority
const LEVEL_PRIORITIES: Record<RepLevel, number> = {
  [RepLevel.National]: 4,
  [RepLevel.State]: 3,
  [RepLevel.City]: 2,
  [RepLevel.County]: 1, // technically we dont even have county data
};

// Scoring weights for different factors
const SCORING_WEIGHTS = {
  tags: 0.6, // 60% weight for tag relevance
  freshness: 0.3, // 30% weight for how recent the bill is
  level: 0.1, // 10% weight for government level
};

const calculateTagScore = (
  userTags: UserPreferences["tags"] = DEFAULT_TAG_PREFERENCES,
  itemTags?: AllAllowedTags[]
): number => {
  if (!itemTags || itemTags.length === 0) return 0;

  // Find overlap between user tags and item tags
  const matchedTags = userTags.filter((tag) => itemTags.includes(tag));
  const overlapBooster = matchedTags.length * 3;

  // Normalize to 0-1 range (assuming max possible score is the length of allowed tags)
  return Math.min(overlapBooster / ALLOWED_TAGS.length, 1);
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

const calculateTotalScore = (
  preferences: UserPreferences,
  item: WindyCiviBill
): number => {
  const tagScore = calculateTagScore(preferences.tags, item.allTags);
  const freshnessScore = calculateFreshnessScore(item);
  const levelScore = calculateLevelScore(item.level);
  return (
    tagScore * SCORING_WEIGHTS.tags +
    freshnessScore * SCORING_WEIGHTS.freshness +
    levelScore * SCORING_WEIGHTS.level
  );
};

export const sortLegislationByScore = (
  legislation: WindyCiviBill[],
  preferences: UserPreferences
): WindyCiviBill[] => {
  return [...legislation].sort((a, b) => {
    const scoreA = calculateTotalScore(preferences, a);
    const scoreB = calculateTotalScore(preferences, b);
    return scoreB - scoreA;
  });
};
