import {
  getLastStatus,
  mapToReadableStatus,
  WindyCiviBill,
} from "@windy-civi/domain/legislation";
import { SupportedLocale } from "@windy-civi/domain/locales";
import { filterAllowedTags, getOverlappingTags } from "@windy-civi/domain/tags";
import { UserPreferences } from "@windy-civi/domain/user-preferences";
import { FaGlobe } from "react-icons/fa";
import { Carousel, Tag } from "../../design-system";
import { RobotSvg } from "../../design-system/Icons";
import { classNames } from "../../design-system/styles";
import { getFlagIcon } from "@windy-civi/domain/locales/flags";

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
          "relative flex items-center gap-2 px-3 py-1 transition-all hover:shadow-md",
          "text-slate-800 text-sm uppercase",
          "rounded-lg border border-opacity-10 border-black",
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
        "inline-flex items-center justify-center rounded px-2 text-sm uppercase h-full",
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

type Summary = {
  title: string;
  content: React.ReactElement;
};

export const LegislationItem = ({
  bill,
  gpt,
  locale,
  allTags,
  preferences,
  glow,
}: WindyCiviBill & { glow?: boolean; preferences: UserPreferences }) => {
  const {
    identifier,
    id,
    status,
    link,
    description,
    updated_at,
    statusDate,
    title,
  } = bill;
  const date = updated_at || statusDate;

  // If there is no AI summary or official summary, don't render the component
  // todo: we should filter this from the feed itself.
  if (!gpt?.gpt_summary && !description) {
    return <></>;
  }

  const linkTitle = locale === SupportedLocale.Chicago ? `${identifier}` : id;

  const tags = filterAllowedTags(allTags);

  const summaries = [
    gpt?.gpt_summary
      ? {
          title: "AI Summary",
          content: (
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
        }
      : false,
    description && {
      title: "Official Summary",
      content: description,
    },
    // If the official title is different from the description, add it to the carousel
    title !== description && {
      title: "Official Title",
      content: title,
    },
    tags.length > 0
      ? {
          title: "All Tags",
          content: (
            <div className="flex flex-row flex-wrap justify-center">
              {tags.map((v) => (
                <Tag key={v} className="text-xs" text={v} />
              ))}
            </div>
          ),
        }
      : false,
    {
      title: "Metadata",
      content: (
        <pre className="whitespace-pre-wrap break-words text-xs font-mono text-gray-600">
          {JSON.stringify(bill, null, 2)}
        </pre>
      ),
    },
  ].filter((item): item is Summary => item !== false);

  // Get the tags that overlap with the user's preferences
  const tagsToDisplay = getOverlappingTags(allTags, preferences.tags);

  // If there are no summaries, don't render the component
  if (summaries.length === 0) {
    return null;
  }

  return (
    <article
      style={glow ? newBillGlow : {}}
      className={classNames(
        "mt-4 flex select-text flex-col gap-y-2 rounded border border-gray-200 bg-white p-4",
      )}
    >
      {/* Top Header */}
      <div className="flex flex-col gap-1 items-center">
        {/* First Row - Link and Status */}
        <div className="flex flex-row gap-2">
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
      </div>

      {/* Only show the title if it's different from the description */}
      {title !== description && title && (
        <div className="font-serif text-lg text-center">{title}</div>
      )}

      {/* Carousel of summaries */}
      {summaries.length > 0 && <Carousel data={summaries} />}
    </article>
  );
};
