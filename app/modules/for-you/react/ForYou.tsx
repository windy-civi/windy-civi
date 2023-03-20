import type { Env } from "~/config";
import { RepLevel } from "~/levels";
import type { StyleHack } from "~/ui";
import {
  AddressLookup,
  Container,
  Grid,
  RadioPicker,
  Tag,
  Tagging,
} from "~/ui";
import type { ForYouBill } from "../selector";

import React from "react";
import { FaGlobe } from "react-icons/fa";
import { CiviUpdates, IntroContent } from "~/intro/Intro";
import type { OfficialOffice } from "~/representatives";
import { OfficialOfficeList } from "~/representatives";
import { GithubBanner, RobotSvg } from "~/svg-icons";
import Modal from "~/ui/Modal/Modal";
import { useDemoContent, VotingDemo } from "~app/modules/demos/Demos";

export interface FilterParams {
  address?: string | null;
  tags?: string[] | null;
  level?: RepLevel | null;
}

export type UpdateFiltersFn = (p: FilterParams) => void;

interface ForYouProps {
  legislation: ForYouBill[];
  tags: string[];
  address: string | null;
  updateFilters: UpdateFiltersFn;
  offices: OfficialOffice[] | null;
  filters: FilterParams;
  env: Env;
}

export const ForYouBillFilters = ({
  tags,
  updateFilters,
  filters,
  env,
}: ForYouProps) => {
  return (
    <div>
      <section>
        <div className="flex justify-center">
          <div className="flex w-full max-w-screen-md flex-col justify-center">
            <div className="rounded-lg pt-4">
              <div className="mb-4 rounded-md bg-black bg-opacity-50 px-2 py-1">
                <AddressLookup env={env} />
              </div>
              <RadioPicker<RepLevel | null | undefined | "">
                handleChange={(next) => {
                  if (!next) {
                    updateFilters({
                      ...filters,
                      level: null,
                    });
                  } else {
                    updateFilters({
                      ...filters,
                      level: next,
                    });
                  }
                }}
                defaultValue={filters.level || ""}
                options={[
                  { label: "All", value: "" },
                  { label: "City", value: RepLevel.City },
                  { label: "State", value: RepLevel.State },
                  { label: "National", value: RepLevel.National },
                ]}
              />
              <div className="mt-4">
                <Tagging
                  tags={tags}
                  selected={filters.tags || []}
                  handleClick={(updatedTags) => {
                    updateFilters({ ...filters, tags: updatedTags });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ForYouBills = ({
  legislation,
  showOfficeComponent,
}: ForYouProps & { showOfficeComponent: React.ReactNode }) => {
  const { demoWarnComponent } = useDemoContent();
  return (
    <section>
      <div className="flex justify-center">
        <div className="flex max-w-lg flex-col justify-center">
          <div>
            {showOfficeComponent}
            <div className="flex items-center rounded-xl bg-gray-100 p-4">
              <RobotSvg
                style={{
                  width: "25px",
                  opacity: "0.5",
                  marginRight: "5px" as StyleHack,
                }}
              />
              <span>Summaries generated by ChatGPT. May not be accurate.</span>
            </div>
            {demoWarnComponent}
          </div>
          {legislation.map((l) => (
            <Bill key={l.bill.id + l.bill.title} {...l} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Bill = ({
  bill: { id, title, statusDate, link, description },
  gpt,
  level,
  sponsoredByRep,
}: ForYouBill) => {
  // Chicago MVP Hacks
  const levelsMap: Record<RepLevel, string> = {
    [RepLevel.City]: "Chicago",
    [RepLevel.State]: "IL",
    [RepLevel.County]: "Cook County",
    [RepLevel.National]: "USA",
  };
  const date =
    level === RepLevel.City ? statusDate.split("-")[0].trim() : statusDate;
  id = RepLevel.City ? id.replace("Resolution", "").trim() : id;
  // End Chicago MVP Hacks
  return (
    <article className="mt-4 flex flex-col gap-y-2 rounded border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between text-sm font-light uppercase text-slate-600">
        <a
          target="_blank"
          href={link}
          rel="noreferrer"
          className="flex items-center "
        >
          {levelsMap[level]} {id} <FaGlobe className="pl-1" />
        </a>
        <div>{date}</div>
      </div>
      {sponsoredByRep && (
        <Tag
          className="bg-primary text-white"
          text={`Sponsored By Your Rep: ${sponsoredByRep}`}
        ></Tag>
      )}

      <div className="text-xl font-semibold">{title}</div>
      {gpt?.gpt_summary && (
        <div className="relative rounded-2xl bg-gray-100 px-6 pt-5 pb-2">
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
          <h4 className="font-serif text-lg">{gpt.gpt_summary}</h4>
          {gpt?.gpt_tags && (
            <div className="flex flex-row flex-wrap">
              {gpt.gpt_tags.map((v) => (
                <div className="inline-flex" key={v}>
                  <Tag text={v} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {description && <div className="mx-10 mt-2 font-mono">{description}</div>}
      <VotingDemo />
    </article>
  );
};

const ForYouShell = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  return (
    <Container>
      <a
        className="absolute left-0 z-10 m-3 -translate-y-16 bg-primary p-3 text-primary-content transition focus:translate-y-0"
        href={`#${skipToContentId}`}
      >
        Skip To Content
      </a>
      <GithubBanner url="https://github.com/civi-social/civi-mvp" />
      <Grid
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,29,135,1) 0vh, rgba(255,82,37,1) 65vh, transparent 90vh)" as StyleHack,
        }}
        className="flex min-h-screen flex-col items-center justify-center bg-gray-300 bg-opacity-50"
      >
        <aside className="via-opacity-30 flex h-full flex-col text-left">
          <div className="px-5 pt-5">
            <IntroContent />
            <div className="mt-5 mb-5 rounded-md bg-opacity-95 text-left">
              {left}
            </div>
            <div className="mt-5 rounded-md bg-pink-200 bg-opacity-60 p-1 text-left">
              <CiviUpdates />
            </div>
          </div>
        </aside>
        <main id={skipToContentId} className="h-full">
          <div className="mx-3 my-5 ">{right}</div>
        </main>
      </Grid>
    </Container>
  );
};

export const ForYou = (props: ForYouProps) => {
  const [showOfficeModal, setShowOfficeModal] = React.useState(false);

  const showOfficeComponent = (
    <>
      {props.offices && (
        <div
          className="mb-4 cursor-pointer rounded bg-primary py-3 px-4 font-bold text-white underline shadow-md"
          onClick={() => {
            setShowOfficeModal(true);
          }}
        >
          <span>See Representatives For This Address.</span>
        </div>
      )}
    </>
  );

  return (
    <>
      {props.offices && showOfficeModal ? (
        <Modal
          isOpen={showOfficeModal}
          onClose={() => setShowOfficeModal(false)}
        >
          <div className="flex w-full max-w-2xl flex-col gap-y-5 justify-self-center">
            <div className="text-center text-lg font-light">
              Representatives for {props.address}.
            </div>
            <OfficialOfficeList officialOffice={props.offices} />
          </div>
        </Modal>
      ) : (
        <ForYouShell
          left={<ForYouBillFilters {...props} />}
          right={
            <ForYouBills {...props} showOfficeComponent={showOfficeComponent} />
          }
        />
      )}
    </>
  );
};
