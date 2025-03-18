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

export enum RepLevel {
  City = "city",
  County = "county",
  State = "state",
  National = "national",
}

export enum SupportedLocale {
  Chicago = "chicago",
  Illinois = "illinois",
  USA = "usa",
}

export enum DataStores {
  Chicago = "Chicago",
  Illinois = "Illinois",
  USA = "USA",
}

export const LocaleMap: Record<SupportedLocale, SupportedLocale[]> = {
  [SupportedLocale.Chicago]: [
    SupportedLocale.Chicago,
    SupportedLocale.Illinois,
    SupportedLocale.USA,
  ],
  [SupportedLocale.Illinois]: [SupportedLocale.Illinois, SupportedLocale.USA],
  [SupportedLocale.USA]: [SupportedLocale.USA],
};
