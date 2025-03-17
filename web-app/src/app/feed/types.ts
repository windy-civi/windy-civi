import { Env, UserPreferences, WindyCiviBill } from "@windy-civi/domain/types";

export interface FeedLoaderData {
  env: Env;
  userPreferences: UserPreferences;
  feedData: WindyCiviBill[];
}
