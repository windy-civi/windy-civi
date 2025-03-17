import { useLoaderData } from "react-router-dom";
import type { PreferencesLoaderData } from "./types";
import { BillFilters } from "./components/Filters";

export function Preferences() {
  const data = useLoaderData() as PreferencesLoaderData;

  return (
    <BillFilters
      filters={data.filters}
      updateFilters={() => {}}
      saveToFeed={() => {}}
      offices={data.offices}
      title="Preferences"
    />
  );
}
