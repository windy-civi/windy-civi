import { AllAllowedTags } from "../constants";
import { Locales } from "../locales";

export type UserPreferences = {
  location: Locales; // source locale, which can be composed. For example, "chicago" -> "usa"
  tags: AllAllowedTags[]; // list of Tag IDs user wants to subscribe to
  // theme: string; // theme user wants to use for the ForYou page
};
