import { Env, LegislationFeed, FilterParams } from "@windy-civi/domain/types";
import { RouteOption } from "./feed-ui.constants";
import { OfficialOffice } from "@windy-civi/domain/representatives/representatives.types";

export interface FeedLoaderData extends LegislationFeed {
  env: Env;
  offices: OfficialOffice[] | null;
  filters: FilterParams;
  globalState: GlobalState;
}

export interface FeedProps extends FeedLoaderData {
  updateFilters: UpdateFiltersFn;
  updateGlobalState: UpdateGlobalStateFn;
  saveToFeed: (next: Partial<FilterParams>) => void;
  deleteAllData: () => void;
}

export interface GlobalState {
  lastVisited: string; // timestamp
  hideLLMWarning: boolean;
  route: RouteOption;
}

export type UpdateFiltersFn = (p: Partial<FilterParams>) => void;

export type UpdateGlobalStateFn = (p: Partial<GlobalState>) => void;

export type FeedFilterProps = FeedProps & {
  showAllReps?: () => void;
};
