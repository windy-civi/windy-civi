import {
  LocationFilter,
  getLocationInformationText,
} from "@windycivi/domain/filters";
import { getLegislators } from "@windycivi/domain/representatives";
import type { OfficialOffice } from "@windycivi/domain/representatives/representatives.types";
import { useState, type FC } from "react";
import { DataField, ResultCard } from "~app/modules/design-system";
import { FeedFilterProps } from "../feed-ui.types";

export const RepresentativesList: FC<{
  officialOffice: OfficialOffice[];
}> = ({ officialOffice }) => {
  return (
    <>
      {officialOffice.map((s: OfficialOffice) => (
        <RepresentativeCard key={s.official.name} {...s} />
      ))}
    </>
  );
};

export const RepresentativeCard = (s: OfficialOffice) => {
  return (
    <ResultCard
      key={s.office.name + s.official.name}
      title={s.office.name}
      subtitle={s.official.name}
      channels={
        <>
          {s.official.channels?.map((channel) => (
            <li key={channel.type + channel.id}>
              <DataField {...channel} />
            </li>
          ))}
          {s.official.phones?.map((id) => (
            <li key={id}>
              <DataField type="Phone" id={id} />
            </li>
          ))}
          {s.official.emails?.map((id) => (
            <li key={id}>
              <DataField type="Email" id={id} />
            </li>
          ))}
          {s.official.urls?.map((id) => (
            <li key={id}>
              <DataField type="URL" id={id} />
            </li>
          ))}
        </>
      }
    />
  );
};

export const Legislator = (
  person: ReturnType<typeof getLegislators>[0] & {
    onClick: (key: string) => void;
  },
) => {
  return (
    <span
      role="button"
      className="cursor-pointer select-text underline decoration-dotted hover:underline"
      onClick={() => person.onClick(getRepKey(person))}
    >
      <span className="opacity-80">{person.title}</span>{" "}
      <span className="">{person.name}</span>
    </span>
  );
};

type LegislatorsFunc = {
  offices: OfficialOffice[] | null;
  location: LocationFilter;
  showAllReps: FeedFilterProps["showAllReps"];
};

export const Legislators = ({ offices, showAllReps }: LegislatorsFunc) => {
  const [officeToShow, setShowOfficeToShow] = useState("");
  const officialOffice = offices?.find(
    (office) => getRepKey(office) === officeToShow,
  );
  return (
    <>
      {getLegislators(offices).map((person) => (
        <div key={person.name} className="mb-1">
          {officialOffice && getRepKey(person) === getRepKey(officialOffice) ? (
            <div key={person.name} className="m-2">
              <RepresentativeCard {...officialOffice} />
            </div>
          ) : (
            <Legislator
              {...person}
              onClick={(key) => {
                setShowOfficeToShow(key);
              }}
            />
          )}
        </div>
      ))}
      <div
        role="button"
        className="inline-block rounded bg-opacity-50 uppercase text-white underline decoration-dotted"
        onClick={showAllReps}
      >
        See More
      </div>
    </>
  );
};

export const LegislatorsToggle = (props: LegislatorsFunc) => {
  const [showSponsorBoxMobile, setShowSponsorBoxMobile] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <div className="inline-block rounded bg-black bg-opacity-20 px-5 py-1">
          <div
            className="cursor-pointer text-xs underline decoration-dotted"
            onClick={() => setShowSponsorBoxMobile(!showSponsorBoxMobile)}
          >
            {showSponsorBoxMobile ? "Close" : "See Your Representatives"}
          </div>
          {showSponsorBoxMobile && (
            <div className="p-2 text-xs">
              <LegislatorsBox {...props} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const LegislatorsInfo = (
  props: LegislatorsFunc & { className?: string },
) => {
  const legislators = getLegislators(props.offices);
  if (!legislators.length) {
    return <></>;
  }
  return (
    <div className={props.className}>
      {/* For Mobile */}
      <div className="block lg:hidden">
        <LegislatorsToggle
          offices={props.offices}
          location={props.location}
          showAllReps={props.showAllReps}
        />
      </div>
      {/* For Desktop */}
      <div className="my-2 hidden text-base lg:block">
        <LegislatorsBox {...props} />
      </div>
    </div>
  );
};

const LegislatorsBox = (props: LegislatorsFunc) => {
  const { levelText } = getLocationInformationText(props.location);
  const legislators = getLegislators(props.offices);
  if (!legislators) {
    return <></>;
  }
  return (
    <div>
      <div className="mb-1 text-sm uppercase opacity-70 lg:text-base lg:font-bold">
        Legislators at {levelText} level
      </div>
      <div className="px-2">
        <Legislators
          offices={props.offices}
          showAllReps={props.showAllReps}
          location={props.location}
        />
      </div>
    </div>
  );
};

const getRepKey = (person: {
  official: { name: string };
  office: { name: string };
}) => person.office.name + person.official.name;
