import { Env } from "@windy-civi/domain/drivers";
import { AllAllowedTags } from "@windy-civi/domain/tags";
import { UserPreferences } from "@windy-civi/domain/user-preferences";

export type UserPreferencesLoaderData = {
  env: Env;
  data: {
    availableTags: AllAllowedTags[];
  };
  preferences: UserPreferences;
};
