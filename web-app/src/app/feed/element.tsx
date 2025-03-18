import { useLoaderData } from "react-router-dom";

import { FeedLoaderData } from "./types";
import { LegislationItem } from "./components/LegislationItem";

export function Feed() {
  const result = useLoaderData() as FeedLoaderData;

  return (
    <>
      {result.feed.map((item) => (
        <LegislationItem
          preferences={result.preferences}
          key={item.bill.id + item.bill.title}
          {...item}
        />
      ))}
    </>
  );
}
