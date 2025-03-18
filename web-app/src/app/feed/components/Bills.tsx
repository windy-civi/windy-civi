import { FaGlobe } from "react-icons/fa";

import {
  getLastStatus,
  mapToReadableStatus,
  WindyCiviBill,
} from "@windy-civi/domain/legislation";
import { RepLevel } from "@windy-civi/domain/locales";
import { Carousel, Tag } from "../../design-system";
import { FeedLoaderData } from "../types";
import { RobotSvg } from "../../design-system/Icons";
import { classNames } from "../../design-system/styles";

const newBillGlow = {
  filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))",
};

export const FeedBills = (props: Pick<FeedLoaderData, "feed">) => {
  return (
    <>
      {props.feed.map((l) => (
        <Bill key={l.bill.id + l.bill.title} {...l} />
      ))}
    </>
  );
};

// const NoResults = () => (
//   <div className="mt-5 w-full flex-1 rounded bg-white bg-opacity-80 p-10 font-serif text-black">
//     <div className="text-xl">No Results Found.</div>
//     <p>
//       Try updating your preferences. Also feel free to submit a bug on our{" "}
//       <a
//         className="underline"
//         href="https://github.com/chihacknight/breakout-groups/issues/219"
//         target="_blank"
//         rel="noreferrer"
//       >
//         Chi Hack Night
//       </a>{" "}
//       channel.
//     </p>
//   </div>
// );

const Bill = ({
  bill,
  gpt,
  level,
  allTags,
  glow,
}: WindyCiviBill & { glow?: boolean }) => {
  const levelsMap: Record<RepLevel, string> = {
    [RepLevel.City]: "Chicago",
    [RepLevel.State]: "IL",
    [RepLevel.County]: "Cook County",
    [RepLevel.National]: "USA",
  };
  const {
    identifier,
    id,
    title,
    status,
    link,
    description,
    updated_at,
    statusDate,
  } = bill;
  const date = updated_at || statusDate;

  const lastStatus = getLastStatus(status);
  const readableStatus = mapToReadableStatus(level, lastStatus);
  const linkTitle = level === RepLevel.City ? `${identifier}` : id;

  const summaries = [
    {
      title: "AI Summary",
      content: gpt?.gpt_summary && (
        <div className="relative px-3">
          <RobotSvg
            style={{
              width: "33px",
              position: "absolute",
              right: "-15px",
              top: "-15px",
              transform: "rotate(9deg)",
              opacity: "0.5",
            }}
          />
          <h4 className="font-mono text-sm">{gpt.gpt_summary}</h4>
        </div>
      ),
    },
    {
      title: "Official Summary",
      content: description && description,
    },
  ].filter((c) => c.content);
  return (
    <article
      style={glow ? newBillGlow : {}}
      className={classNames(
        "mt-4 flex select-text flex-col gap-y-2 rounded border border-gray-200 bg-white p-4",
      )}
    >
      {allTags && (
        <div className="flex flex-row flex-wrap justify-center">
          {[...new Set(allTags)].map((v) => (
            <div className="inline-flex" key={v}>
              <Tag className="text-xs" text={v} />
            </div>
          ))}
        </div>
      )}
      <div className="font-serif text-lg">{title}</div>
      <div className="text-center">
        <a
          target="_blank"
          href={link}
          className={classNames(
            "inline-block rounded px-2 text-sm uppercase",
            readableStatus.type === "pass" && "bg-green-200",
            readableStatus.type === "in-progress" && "bg-blue-200",
            readableStatus.type === "fail" && "bg-red-200",
          )}
          rel="noreferrer"
        >
          {readableStatus.name} {date}
        </a>
      </div>
      {summaries.length > 0 && <Carousel data={summaries} />}

      <div className="flex flex-wrap items-center justify-end">
        <a
          target="_blank"
          href={link}
          rel="noreferrer"
          className="flex items-center text-sm font-light uppercase text-slate-600"
        >
          {levelsMap[level]} {linkTitle} <FaGlobe className="pl-1" />
        </a>
      </div>
    </article>
  );
};
