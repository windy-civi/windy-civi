import {
  getLastStatus,
  mapToReadableStatus,
  WindyCiviBill,
} from "@windy-civi/domain/legislation";
import { SupportedLocale } from "@windy-civi/domain/locales";
import { getOverlappingTags } from "@windy-civi/domain/tags";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { FaGlobe } from "react-icons/fa";
import { Carousel, JsonViewer, Tag } from "../../design-system";
import { classNames, StyleHack } from "../../design-system/styles";
import { getFlagIcon } from "@windy-civi/domain/locales/flags";
import { extractHeadlineFromSummary } from "@windy-civi/domain/legislation/summary";

const newBillGlow = {
  filter: "drop-shadow(0px 0px 8px rgb(59, 130, 246))",
};
interface LegislationLinkProps {
  locale: SupportedLocale;
  link: string;
  linkTitle: string;
}

export const LegislationLink = ({
  locale,
  link,
  linkTitle,
}: LegislationLinkProps) => {
  const flagSrc = getFlagIcon(locale);

  return (
    <div className="flex flex-wrap items-center justify-end">
      <a
        target="_blank"
        href={link}
        rel="noreferrer"
        className={classNames(
          "relative flex items-center gap-2 px-3 py-1 transition-all hover:shadow-sm",
          "text-slate-800 text-xs uppercase",
          "rounded-l-lg border border-opacity-10 border-black",
          "bg-white",
        )}
      >
        {flagSrc && (
          <img
            src={flagSrc}
            alt={`${locale} flag`}
            className="w-5 h-3 object-cover"
          />
        )}
        <div className="flex flex-row items-center gap-1">
          {locale} {linkTitle} <FaGlobe className="inline opacity-60" />
        </div>
      </a>
    </div>
  );
};

type BillStatusProps = {
  locale: SupportedLocale;
  status: string[];
  link: string;
  date?: string;
};

const BillStatus = ({ locale, status, link, date }: BillStatusProps) => {
  const lastStatus = getLastStatus(status);
  const readableStatus = mapToReadableStatus(locale, lastStatus);

  return (
    <a
      target="_blank"
      href={link}
      className={classNames(
        "inline-flex items-center justify-center rounded-r-lg px-2 text-xs uppercase h-full",
        "transition-all hover:shadow-sm",
        readableStatus.type === "pass" && "bg-green-200",
        readableStatus.type === "in-progress" && "bg-blue-200",
        readableStatus.type === "fail" && "bg-red-200",
      )}
      rel="noreferrer"
    >
      {readableStatus.name} {date}
    </a>
  );
};

export const NoResults = () => (
  <div className="mt-5 w-full flex-1 rounded bg-white bg-opacity-80 p-10 font-serif text-black">
    <div className="text-xl">No Results Found.</div>
    <p>
      Try updating your preferences. Also feel free to submit a bug on our{" "}
      <a
        className="underline"
        href="#/contribute"
        target="_blank"
        rel="noreferrer"
      >
        Slack
      </a>{" "}
      channel.
    </p>
  </div>
);

type Summary = {
  title: string;
  content: React.ReactElement;
};

const HeadlineBlurb = ({
  headline,
  details,
}: {
  headline?: string | null;
  details?: string | null;
}) => {
  let title = null;
  let description = null;

  const areTheSame = headline && details && headline === details;
  if (areTheSame) {
    title = headline;
  }
  const hasBoth = headline && details;
  if (hasBoth) {
    title = headline;
    description = details;
  }

  if (headline && !details) {
    title = headline;
  }
  if (!headline && details) {
    title = details;
  }

  return (
    <div className="relative px-3">
      <div>
        <div className="font-serif text-lg text-center mb-2">{title}</div>
        {description && (
          <h4 className="font-mono text-sm text-center mb-2">{description}</h4>
        )}
      </div>
    </div>
  );
};

export const LegislationItem = ({
  bill,
  gpt,
  locale,
  allTags,
  preferences,
  glow,
}: WindyCiviBill & { glow?: boolean; preferences: UserPreferences }) => {
  const { identifier, id, status, link, updated_at, statusDate } = bill;
  const date = updated_at || statusDate;

  // If there is no AI summary or official summary, don't render the component
  // todo: we should filter this from the feed itself.
  if (!gpt?.gpt_summary && !bill.description && !bill.bill_summary) {
    return <></>;
  }

  const linkTitle = locale === SupportedLocale.Chicago ? `${identifier}` : id;

  const { headline, details } = extractHeadlineFromSummary(gpt);

  const officialTitle = bill.title;
  const officialSummary = bill.description || bill.bill_summary;

  const summaries = [
    headline || details
      ? {
          title: "Windy Civi Summary",
          content: <HeadlineBlurb headline={headline} details={details} />,
        }
      : false,
    officialTitle || officialSummary
      ? {
          // Hack for now, should decompose better
          title: bill.bill_summary ? "Councilmatic Summary" : "Official",
          content: (
            <HeadlineBlurb headline={officialTitle} details={officialSummary} />
          ),
        }
      : false,
    {
      title: "Legislation Details",
      content: <JsonViewer data={bill} />,
    },
    gpt?.gpt_summary && {
      title: "Windy Civi Analysis Results",
      content: <JsonViewer data={gpt} />,
    },
  ].filter((item): item is Summary => item !== false);

  // Get the tags that overlap with the user's preferences
  const tagsToDisplay =
    preferences.tags.length > 0
      ? getOverlappingTags(allTags, preferences.tags)
      : allTags;

  // If there are no summaries, don't render the component
  if (summaries.length === 0) {
    return null;
  }

  return (
    <article
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)" as StyleHack,
        backdropFilter: "blur(10px)",
        ...(glow && newBillGlow),
      }}
      className={classNames(
        "mb-4 flex select-text flex-col rounded-md border border-gray-20 p-1",
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col gap-1 justify-between items-center">
        {/* First Row - Link and Status */}
        <div className="flex flex-row">
          <LegislationLink locale={locale} link={link} linkTitle={linkTitle} />
          <div className="flex items-stretch">
            <BillStatus
              locale={locale}
              status={status}
              link={link}
              date={date}
            />
          </div>
        </div>
      </div>

      {/* Carousel of summaries */}
      {summaries.length > 0 && <Carousel data={summaries} />}

      {/* Second Row - Tags */}
      {tagsToDisplay && (
        <div className="flex flex-row flex-wrap justify-center">
          {tagsToDisplay.map((v) => (
            <div className="inline-flex" key={v}>
              <Tag className="text-xs" text={v} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};
