import { useLoaderData } from "react-router-dom";

import { FeedBills } from "./components/Bills";
import { FeedLoaderData } from "./types";

export function Feed() {
  const result = useLoaderData() as FeedLoaderData;
  console.log("result", result);

  return <FeedBills feedData={result.feedData} />;
}
