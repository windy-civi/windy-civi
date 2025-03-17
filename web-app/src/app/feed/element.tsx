import { useLoaderData } from "react-router-dom";

import { FeedBills } from "./components/Bills";
import { FeedLoaderData } from "./types";

export function Feed() {
  const result = useLoaderData() as FeedLoaderData;

  return <FeedBills feed={result.feed} />;
}
