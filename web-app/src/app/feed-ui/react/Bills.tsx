import { FaGlobe } from "react-icons/fa";

import { RepLevel } from "@windy-civi/domain/constants";
import {
  getBillUpdateAt,
  getLastStatus,
  mapToReadableStatus,
} from "@windy-civi/domain/filters/filters.utils";
import { WindyCiviBill } from "@windy-civi/domain/types";
import { Carousel, RobotSvg, Tag, classNames } from "../../design-system";
import { FeedProps } from "../feed-ui.types";
import { LevelFilter } from "./Filters";

const newBillGlow = {
  filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))",
};

// Tag priority mapping - higher number means higher priority
// Leaning pretty liberal for this MVP. todo: make more balanced.
const TAG_PRIORITIES: Record<string, number> = {
  // Highest Priority (5) - Immediate impact on basic rights and safety
  Abortion: 5,
  "Climate Change": 5,

  // High Priority (4) - Essential services and major policy areas
  "Health Care": 4,
  Education: 4,
  Transit: 4,

  // Medium Priority (3) - Important but less immediate impact
  Immigration: 3,
  "Public Safety": 3,
  "Civil Rights": 3,
  Economy: 3,
  Democracy: 3,
  Ordinance: 3,

  // Lower Priority (2) - Procedural and structural issues
  Resolution: 2,
  "States Rights": 2,
  "Foreign Policy": 2,

  // Base Priority (1) - Catchall
  Other: 1,
};

// Level priorities - higher number means higher priority
const LEVEL_PRIORITIES: Record<RepLevel, number> = {
  [RepLevel.National]: 4,
  [RepLevel.State]: 3,
  [RepLevel.City]: 2,
  [RepLevel.County]: 1, // technically we dont even have county data
};

// Scoring weights for different factors
const SCORING_WEIGHTS = {
  tags: 0.4, // 40% weight for tag relevance
  freshness: 0.35, // 35% weight for how recent the bill is
  level: 0.25, // 25% weight for government level
};

const calculateTagScore = (tags: string[] | undefined): number => {
  if (!tags || tags.length === 0) return 0;

  const totalPriority = tags.reduce((priority, tag) => {
    return priority + (TAG_PRIORITIES[tag] || 0);
  }, 0);

  // Normalize to 0-1 range (assuming max possible score is 15)
  return Math.min(totalPriority / 15, 1);
};

const calculateFreshnessScore = (item: WindyCiviBill): number => {
  const updateDate = getBillUpdateAt(item);
  const now = new Date().getTime();

  // Convert string date to timestamp
  const updateTimestamp = new Date(updateDate).getTime();
  const ageInDays = (now - updateTimestamp) / (1000 * 60 * 60 * 24);

  // Exponential decay over 30 days
  return Math.exp(-ageInDays / 30);
};

const calculateLevelScore = (level: RepLevel): number => {
  return LEVEL_PRIORITIES[level] / Math.max(...Object.values(LEVEL_PRIORITIES));
};

const calculateTotalScore = (item: WindyCiviBill): number => {
  const tagScore = calculateTagScore(item.allTags);
  const freshnessScore = calculateFreshnessScore(item);
  const levelScore = calculateLevelScore(item.level);

  return (
    tagScore * SCORING_WEIGHTS.tags +
    freshnessScore * SCORING_WEIGHTS.freshness +
    levelScore * SCORING_WEIGHTS.level
  );
};

const sortLegislationByScore = (
  legislation: WindyCiviBill[],
): WindyCiviBill[] => {
  return [...legislation].sort((a, b) => {
    const scoreA = calculateTotalScore(a);
    const scoreB = calculateTotalScore(b);
    return scoreB - scoreA;
  });
};

export const FeedBills = (props: FeedProps) => {
  const { filteredLegislation } = props;
  const sortedLegislation = sortLegislationByScore(filteredLegislation);

  return (
    <>
      {sortedLegislation.map((l) => (
        <Bill key={l.bill.id + l.bill.title} {...l} />
      ))}
    </>
  );
};

export const FeedBillsOld = (props: FeedProps) => {
  const lastVisited = props.globalState.lastVisited;

  // Getting the index of the first item after the last visit date, and splitting there.
  let indexOfSplit = -1;
  for (let i = 0; i < props.filteredLegislation.length; i++) {
    const billUpdatedAt = getBillUpdateAt(props.filteredLegislation[i]);
    if (billUpdatedAt <= lastVisited) {
      indexOfSplit = i;
      break;
    }
  }

  let bills: React.ReactNode;
  // No Results
  if (props.filteredLegislation.length === 0) {
    bills = <NoResults />;
    // We have a last read date
  } else if (indexOfSplit > 0) {
    const unreadList = props.filteredLegislation.slice(0, indexOfSplit);
    const readList = props.filteredLegislation.slice(indexOfSplit);
    bills = (
      <>
        <div
          style={newBillGlow}
          className="mt-4 rounded bg-blue-500 px-3 py-1 text-center text-lg font-bold uppercase"
        >
          New Updates Since Your Last Visit
        </div>
        {unreadList.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} glow={true} />
        ))}
        <div
          style={{ height: "40px" }}
          className="mt-4 flex items-center justify-center rounded bg-green-500 px-3 py-1 text-center text-lg font-bold uppercase"
        >
          All Caught Up
        </div>
        {readList.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} />
        ))}
      </>
    );
  } else {
    bills = (
      <>
        {props.filteredLegislation.map((l) => (
          <Bill key={l.bill.id + l.bill.title} {...l} />
        ))}
      </>
    );
  }

  return (
    <section>
      <div className="flex justify-center">
        <div className="flex max-w-lg flex-col justify-center">
          <LevelFilter {...props} />
          {bills}
        </div>
      </div>
    </section>
  );
};

const NoResults = () => (
  <div className="mt-5 w-full flex-1 rounded bg-white bg-opacity-80 p-10 font-serif text-black">
    <div className="text-xl">No Results Found.</div>
    <p>
      Try updating your preferences. Also feel free to submit a bug on our{" "}
      <a
        className="underline"
        href="https://github.com/chihacknight/breakout-groups/issues/219"
        target="_blank"
        rel="noreferrer"
      >
        Chi Hack Night
      </a>{" "}
      channel.
    </p>
  </div>
);

const Bill = ({
  bill,
  gpt,
  level,
  sponsoredByRep,
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
      {sponsoredByRep && (
        <div className="text-center text-xs uppercase">
          {" "}
          Sponsored By Your Rep: {sponsoredByRep}
        </div>
      )}
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
