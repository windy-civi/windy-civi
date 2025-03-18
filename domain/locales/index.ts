import { isNullish, Nullish } from "../scalars";

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

export const isLocale = (locale: unknown): locale is Locales =>
  typeof locale === "string" &&
  Object.values(SupportedLocale).includes(locale as SupportedLocale);

export const localeValueToEnum = (locale: unknown): SupportedLocale | null => {
  switch (locale) {
    case "chicago":
      return SupportedLocale.Chicago;
    case "illinois":
      return SupportedLocale.Illinois;
    case "usa":
      return SupportedLocale.USA;
    default:
      return null;
  }
};

export const forEachLocale = (
  cb: (l: SupportedLocale) => void,
  locale?: SupportedLocale | null
): Error | null => {
  if (locale) {
    cb(locale);
  } else {
    for (const locale of Object.values(SupportedLocale)) {
      cb(locale);
    }
  }
  return null;
};

export type Locales = `${SupportedLocale}`;

export const getLocale = (
  formattedAddress: string | Nullish
): null | Locales => {
  return formattedAddress && /Chicago, IL/gi.test(formattedAddress)
    ? "chicago"
    : null;
};

export const isSupportedLocale = (
  locationParam: unknown
): locationParam is SupportedLocale => {
  if (isNullish(locationParam)) {
    return false;
  }
  return Object.values(SupportedLocale).includes(
    locationParam as SupportedLocale
  );
};

// City Level
export const isCityLevel = (location: Locales): boolean =>
  isLocationChicago(location);

export const isLocationChicago = (location: Locales) =>
  isAddressChicago(location) || location === SupportedLocale.Chicago;

const isAddressChicago = (location: Locales) =>
  stringIsInAddress(
    ["Chicago, IL", "Chicago,IL", "Chicago, Illinois", "Chicago,Illinois"],
    location
  );

// State Level

export const isStateLevel = (location: Locales): boolean =>
  isLocationIL(location);

const isAddressIL = (location: Locales) =>
  stringIsInAddress([", IL", ",IL"], location);

export const isLocationIL = (location: Locales) =>
  isAddressIL(location) || location === SupportedLocale.Illinois;

const stringIsInAddress = (variations: string[], str: string) =>
  variations.some((variation) =>
    str.toLowerCase().includes(variation.toLowerCase())
  );

export const parseRepLevel = (level?: string | null): RepLevel | null => {
  return !level ? null : level === "true" ? null : (level as RepLevel);
};

export const getLocationInformationText = (location: Locales) => {
  let locationName = "";
  let levelText = "";
  if (isLocationChicago(location)) {
    locationName = "Chicago";
    levelText = "Local, State, & National";
  } else if (isLocationIL(location)) {
    locationName = "Illinois";
    levelText = "State & National";
  } else {
    locationName = "America";
    levelText = "National";
  }
  return { locationName, levelText };
};
