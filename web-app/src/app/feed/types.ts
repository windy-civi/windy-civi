import { Env } from "@windy-civi/domain/drivers";
import { WindyCiviBill } from "@windy-civi/domain/legislation";
import { UserPreferences } from "@windy-civi/domain/user-preferences";

export interface FeedLoaderData {
  env: Env;
  preferences: UserPreferences;
  feed: WindyCiviBill[];
}
