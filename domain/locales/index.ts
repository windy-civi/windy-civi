import { isNullish, Nullish } from "../scalars";

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

// Total number of representatives in each legislative body
export const TOTAL_REPRESENTATIVES = {
  [SupportedLocale.USA]: {
    SENATE: 100, // 100 US Senators
    HOUSE: 435, // 435 US Representatives
    TOTAL: 535, // Total Congress members
  },
  [SupportedLocale.Illinois]: {
    SENATE: 59, // Illinois State Senators
    HOUSE: 118, // Illinois State Representatives
    TOTAL: 177, // Total Illinois General Assembly
  },
  [SupportedLocale.Chicago]: {
    COUNCIL: 50, // Chicago City Council Alderpersons
    TOTAL: 50,
  },
} as const;

export const LOCALE_GRADIENTS = {
  [SupportedLocale.USA]:
    "linear-gradient(to bottom, rgba(0,0,255,1.0) 0px, rgba(255,255,255,1.0) 600px, rgba(255,0,0,1.0) 1000px, rgba(0,0,0,0.1) 1500px)",
  [SupportedLocale.Illinois]:
    "linear-gradient(to bottom, rgba(255,255,255,1.0) 0px, rgba(255,196,0,1.0) 600px, rgba(255,255,255,1.0) 1000px, rgba(0,0,0,0.1) 1500px)",
  [SupportedLocale.Chicago]:
    "linear-gradient(to bottom, rgba(31,124,192,1.0) 0px, rgba(255,255,255,1.0) 600px, rgba(206,17,38,1.0) 1000px, rgba(0,0,0,0.1) 1500px)",
} as const;

export const DEFAULT_GRADIENT =
  "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)";

// should probably be in tags, but co-locating for now with other skin stuff
export const TAG_GRADIENTS = {
  economy:
    "linear-gradient(to bottom, rgba(168, 85, 247, 1.0) 0px, rgba(168, 85, 247, 0.1) 600px, rgba(168, 85, 247, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  education:
    "linear-gradient(to bottom, rgba(234, 179, 8, 1.0) 0px, rgba(234, 179, 8, 0.1) 600px, rgba(234, 179, 8, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  democracy:
    "linear-gradient(to bottom, rgba(107, 114, 128, 1.0) 0px, rgba(107, 114, 128, 0.1) 600px, rgba(107, 114, 128, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "health-care":
    "linear-gradient(to bottom, rgba(59, 130, 246, 1.0) 0px, rgba(59, 130, 246, 0.1) 600px, rgba(59, 130, 246, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "public-safety":
    "linear-gradient(to bottom, rgba(99, 102, 241, 1.0) 0px, rgba(99, 102, 241, 0.1) 600px, rgba(99, 102, 241, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  transit:
    "linear-gradient(to bottom, rgba(249, 115, 22, 1.0) 0px, rgba(249, 115, 22, 0.1) 600px, rgba(249, 115, 22, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  abortion:
    "linear-gradient(to bottom, rgba(244, 63, 94, 1.0) 0px, rgba(244, 63, 94, 0.1) 600px, rgba(244, 63, 94, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  immigration:
    "linear-gradient(to bottom, rgba(6, 182, 212, 1.0) 0px, rgba(6, 182, 212, 0.1) 600px, rgba(6, 182, 212, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "foreign-policy":
    "linear-gradient(to bottom, rgba(236, 72, 153, 1.0) 0px, rgba(236, 72, 153, 0.1) 600px, rgba(236, 72, 153, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "climate-change":
    "linear-gradient(to bottom, rgba(34, 197, 94, 1.0) 0px, rgba(34, 197, 94, 0.1) 600px, rgba(34, 197, 94, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "2nd-amendment":
    "linear-gradient(to bottom, rgba(6, 182, 212, 1.0) 0px, rgba(6, 182, 212, 0.1) 600px, rgba(6, 182, 212, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "civil-rights":
    "linear-gradient(to bottom, rgba(239, 68, 68, 1.0) 0px, rgba(239, 68, 68, 0.1) 600px, rgba(239, 68, 68, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "lgbtq-rights":
    "linear-gradient(to bottom, rgba(168, 85, 247, 1.0) 0px, rgba(168, 85, 247, 0.1) 600px, rgba(168, 85, 247, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
  "trans-rights":
    "linear-gradient(to bottom, rgba(168, 85, 247, 1.0) 0px, rgba(168, 85, 247, 0.1) 600px, rgba(168, 85, 247, 0.05) 1000px, rgba(0,0,0,0.1) 1500px)",
} as const;

export const getLocaleGradient = (
  locale: SupportedLocale | null | undefined,
  pathname?: string
): string => {
  // Handle special routes
  if (!locale && (!pathname || pathname === "/" || pathname === "/@you")) {
    return DEFAULT_GRADIENT;
  }

  // Check if it's a tag route
  if (pathname) {
    const tagSlug = pathname.replace("/", "");
    if (tagSlug in TAG_GRADIENTS) {
      return TAG_GRADIENTS[tagSlug as keyof typeof TAG_GRADIENTS];
    }
  }

  // Handle locale routes
  if (locale) {
    return LOCALE_GRADIENTS[locale] || DEFAULT_GRADIENT;
  }

  return DEFAULT_GRADIENT;
};
