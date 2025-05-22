import { isSupportedLocale, SupportedLocale } from "@windy-civi/domain/locales";
import { pipe } from "@windy-civi/domain/scalars";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { cookieFactory, getCookieFromString } from "../utils/cookies";
import { filterAllowedTags } from "@windy-civi/domain/tags";

const DEFAULT_TAGS = [] satisfies string[];
const DEFAULT_LOCATION = "usa";

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  location: DEFAULT_LOCATION,
  tags: DEFAULT_TAGS,
};

/**
 * Parses a comma-separated string of tags into an array of strings.
 */
export const parseTagString = (tags: string | null | undefined): string[] => {
  return tags?.split(",").filter((tag) => tag.length > 0) ?? [];
};

/**
 * Parses and validates a location parameter to ensure it's a supported locale.
 */
export const parseLocation = (locationParam: unknown): SupportedLocale =>
  isSupportedLocale(locationParam)
    ? locationParam // Verify locale is a string we support
    : SupportedLocale.USA; // Fallback to USA

// Making async to make it easier to port to future storage async behavior
export const getPreferencesFromCookies = async (cookieHeader?: string) => {
  if (cookieHeader) {
    return {
      location: pipe(
        getCookieFromString(cookieHeader, "location"),
        parseLocation,
      ),
      tags: pipe(
        getCookieFromString(cookieHeader, "tags"),
        parseTagString,
        filterAllowedTags,
      ),
    } satisfies UserPreferences;

    // History State
    // We have a temp hold state that we leverage for actual rendering, while
    // the long running cookie lastVisited can be used to check actual history.
    // const lastVisitHold = getCookieFromString(cookieHeader, "lastVisitHold");
    // const lastVisited = getCookieFromString(cookieHeader, "lastVisited");
  }

  // Picking filters based on if feed or explore
  return DEFAULT_USER_PREFERENCES;
};

export const savePreferencesToCookies = (preferences: UserPreferences) => {
  // Save to cookies
  const cookies = cookieFactory(document);
  Object.entries(preferences).forEach(([key, value]) => {
    if (value) {
      cookies.set(key, typeof value === "string" ? value : String(value));
    } else {
      cookies.delete(key);
    }
  });
};

export const deleteAllData = () => {
  const cookies = cookieFactory(document);
  cookies.delete("location");
  cookies.delete("tags");
  cookies.delete("level");
  cookies.delete("lastVisited");
  cookies.delete("lastVisitHold");
  cookies.delete("pwa-install-prompt");
};
