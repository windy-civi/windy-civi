import { Env, UserPreferences } from "@windy-civi/domain/types";

export type UserPreferencesLoaderData = {
  env: Env;
  data: {
    availableTags: string[];
  };
  preferences: UserPreferences;
};
