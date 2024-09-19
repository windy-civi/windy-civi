import type { RepLevel, SupportedLocale } from "./filters.constants";

export type Locales = `${SupportedLocale}`;

export type LocationFilter = SupportedLocale | AddressFilter | Nullish;

export type AddressFilter = { address: string };

export type Nullish = undefined | "" | null;

export interface FilterParams {
  location: LocationFilter;
  tags: string[] | null;
  availableTags: string[];
  level: RepLevel | null;
}
