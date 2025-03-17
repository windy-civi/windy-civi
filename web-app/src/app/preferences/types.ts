import { OfficialOffice } from "@windy-civi/domain/representatives/representatives.types";
import { Env, UserPreferences } from "@windy-civi/domain/types";

export type UserPreferencesLoaderData = {
  env: Env;
  data: {
    offices: OfficialOffice[] | null;
    availableTags: string[];
  };
  preferences: UserPreferences;
};
