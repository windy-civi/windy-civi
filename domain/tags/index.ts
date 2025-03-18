import { isLocationChicago, Locales } from "../locales";
import { hasOverlap } from "../scalars";

// City level filters for tags that are not GPT tags
export enum CustomChicagoTag {
  "Ordinance" = "City Wide Ordinance",
  "Resolution" = "City Wide Resolution",
}

export const ChicagoTags = Object.values(CustomChicagoTag);

export const ALLOWED_TAGS = [
  "Economy",
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "Climate Change",
  "2nd Amendment",
  "Civil Rights",
  "LGBTQ Rights",
  "Trans Rights",
] as const;

export const ALL_ALLOWED_TAGS = [...ALLOWED_TAGS, ...ChicagoTags] as const;

export type AllowedGptTag = (typeof ALLOWED_TAGS)[number];

export type AllAllowedTags = AllowedGptTag | CustomChicagoTag;

export const TagMap: Record<
  AllAllowedTags,
  { icon: string; background: string }
> = {
  "Climate Change": {
    icon: "🌍",
    background: "rgba(34, 197, 94, 1.0)", // green-500
  },
  "Health Care": {
    icon: "🏥",
    background: "rgba(59, 130, 246, 1.0)", // blue-500
  },
  Education: {
    icon: "🎓",
    background: "rgba(234, 179, 8, 1.0)", // yellow-500
  },
  Economy: {
    icon: "💰",
    background: "rgba(168, 85, 247, 1.0)", // purple-500
  },
  "Civil Rights": {
    icon: "👥",
    background: "rgba(239, 68, 68, 1.0)", // red-500
  },
  "Public Safety": {
    icon: "🚓",
    background: "rgba(99, 102, 241, 1.0)", // indigo-500
  },
  "Foreign Policy": {
    icon: "🌐",
    background: "rgba(236, 72, 153, 1.0)", // pink-500
  },
  Democracy: {
    icon: "🗳",
    background: "rgba(107, 114, 128, 1.0)", // gray-500
  },
  Transit: {
    icon: "🚇",
    background: "rgba(249, 115, 22, 1.0)", // orange-500
  },
  Abortion: {
    icon: "👶",
    background: "rgba(244, 63, 94, 1.0)", // rose-500
  },
  Immigration: {
    icon: "🛂",
    background: "rgba(6, 182, 212, 1.0)", // cyan-500
  },
  "2nd Amendment": {
    icon: "🔫",
    background: "rgba(6, 182, 212, 1.0)", // cyan-500
  },
  "LGBTQ Rights": {
    icon: "🏳️‍🌈",
    background: "rgba(168, 85, 247, 1.0)", // purple-500
  },
  "Trans Rights": {
    icon: "🏳️‍🌈",
    background: "rgba(168, 85, 247, 1.0)", // purple-500
  },
  [CustomChicagoTag.Ordinance]: {
    icon: "🏙️",
    background: "rgba(20, 184, 166, 1.0)", // teal-500
  },
  [CustomChicagoTag.Resolution]: {
    icon: "📜",
    background: "rgba(244, 63, 94, 1.0)", // rose-500
  },
};

// Leaning pretty liberal for this MVP. todo: make more balanced.
export const DEFAULT_TAG_PREFERENCES: AllAllowedTags[] = [
  "2nd Amendment",
  "Abortion",
  "Climate Change",
  "Civil Rights",
  "LGBTQ Rights",
  "Trans Rights",
];

export const AVAILABLE_TAGS = [...ALLOWED_TAGS];

export const hasTags = (tags: unknown): tags is string[] => {
  return Boolean(tags && Array.isArray(tags) && tags.length > 0);
};

export const getTagsBeingFiltered = ({
  tags,
  availableTags,
}: {
  tags: string[];
  availableTags: string[];
}) => {
  return hasTags(tags) ? tags : availableTags;
};

export const stringifyTags = (tags: string[]) => {
  return tags.join(",");
};

export const filterAllowedTags = (tags: string[]): AllAllowedTags[] => {
  return hasTags(tags)
    ? tags.filter((tag): tag is AllAllowedTags =>
        ALL_ALLOWED_TAGS.includes(tag as AllAllowedTags)
      )
    : [];
};

export const parseAvailableTags = (location: Locales) => {
  const availableTags = [];

  // TODO: Move to dynamic tags
  if (isLocationChicago(location)) {
    availableTags.push(...ChicagoTags);
  }

  availableTags.push(...AVAILABLE_TAGS);

  return availableTags;
};

export const tagsOverLap = (tagList1: unknown, tagList2: unknown) => {
  return (
    hasTags(tagList1) && hasTags(tagList2) && hasOverlap(tagList1, tagList2)
  );
};
