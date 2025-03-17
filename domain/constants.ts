export const ALLOWED_GPT_TAGS = [
  "Education",
  "Democracy",
  "Health Care",
  "Public Safety",
  "Transit",
  "Abortion",
  "Immigration",
  "Foreign Policy",
  "States Rights",
  "Civil Rights",
  "Climate Change",
];

// City level filters for tags that are not GPT tags
export enum CustomChicagoTag {
  "Ordinance" = "City Wide Ordinance",
  "Resolution" = "City Wide Resolution",
}

export const ChicagoTags = Object.values(CustomChicagoTag);

export const AVAILABLE_TAGS = [...ALLOWED_GPT_TAGS];

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
