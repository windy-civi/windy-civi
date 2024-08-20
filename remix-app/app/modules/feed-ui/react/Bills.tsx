import { FaGlobe } from "react-icons/fa";
import {
  getBillUpdateAt,
  WindyCiviBill,
  RepLevel,
  getLastStatus,
  mapToReadableStatus,
} from "~app/modules/data/legislation";
import { StyleHack, Tag, classNames } from "~app/modules/design-system";
import { Carousel } from "~app/modules/design-system/Carousel/Carousel";
import { RobotSvg } from "~app/modules/design-system/Icons";
import { FeedProps } from "../feed-ui.types";
import { LevelFilter } from "./Filters";

const newBillGlow = {
  filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))",
};

export const FeedBills = (props: FeedProps) => {
  const lastVisited = props.globalState.lastVisited;

  // Getting the index of the first item after the last visit date, and splitting there.
  let indexOfSplit = -1;
  for (var i = 0; i < props.filteredLegislation.length; i++) {
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
          {!props.globalState.hideLLMWarning && (
            <LLMWarning
              onClick={() => {
                props.updateGlobalState({ hideLLMWarning: true });
              }}
            />
          )}
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
        "mt-4 flex select-text flex-col gap-y-2 rounded border border-gray-200 bg-white p-4"
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
            readableStatus.type === "fail" && "bg-red-200"
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

const LLMWarning = ({ onClick }: { onClick: Function }) => {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-100 bg-opacity-30 p-4 text-sm lg:text-base">
      <RobotSvg
        style={{
          width: "25px",
          opacity: "0.5",
          marginRight: "5px" as StyleHack,
        }}
      />
      <span>Summaries generated by ChatGPT. May not be accurate.</span>
      <span role="button" className="opacity-50" onClick={() => onClick()}>
        x
      </span>
    </div>
  );
};
