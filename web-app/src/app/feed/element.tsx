import { useLoaderData } from "react-router-dom";

import { FeedLoaderData } from "./types";
import { LegislationItem, NoResults } from "./components/LegislationItem";

export function Feed() {
  const result = useLoaderData() as FeedLoaderData;

  if (result.feed.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="xl:mt-2">
      {result.feed.map((item) => (
        <LegislationItem
          preferences={result.preferences}
          key={item.bill.id + item.bill.title}
          {...item}
        />
      ))}
    </div>
  );
}
