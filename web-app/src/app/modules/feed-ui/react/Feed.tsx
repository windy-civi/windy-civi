import { getLocation } from "@windycivi/domain/filters/filters.utils";
import React, { useState } from "react";
import { PWAInstall } from "~app/modules/app-shell/PwaInstaller";
import type { StyleHack } from "~app/modules/design-system";
import { Container, Grid, Modal, classNames } from "~app/modules/design-system";
import { Logo } from "~app/modules/design-system/Logo/Logo";
import { RouteOption } from "../feed-ui.constants";
import { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { FeedBills } from "./Bills";
import { BillFilters, YourFilterSummary } from "./Filters";
import { RepresentativesList } from "./Representatives";

const Navigation = (props: FeedFilterProps) => {
  const [route, setRouteState] = useState(props.globalState.route);
  const setRoute = (next: RouteOption) => {
    props.updateGlobalState({
      route: next,
    });
    setRouteState(next);
  };

  // const hideNav = route === RouteOption.INTRO;

  let mode: React.ReactNode;

  if (route === RouteOption.INTRO || route === RouteOption.EXPLORE) {
    mode = (
      <div className="px-3">
        <BillFilters
          {...props}
          saveToFeed={(next) => {
            props.saveToFeed(next);
            setRoute(RouteOption.FEED);
          }}
          title={
            route === RouteOption.INTRO
              ? "We Want To Help You Engage With The Legislation That Impacts You"
              : "Explore Legislation"
          }
        />
      </div>
    );
  } else {
    mode = (
      <YourFilterSummary
        {...props}
        setIsExploring={() => {
          setRoute(RouteOption.EXPLORE);
        }}
      />
    );
  }
  return (
    <div>
      <div className="mb-2 flex items-center px-3 pt-3">
        <div className="flex-1 flex items-center gap-4">
          <Logo />{" "}
          <a
            href="/help"
            className="uppercase font-bold text-white bg-black bg-opacity-40 py-1 px-2 rounded cursor-pointer hover:shadow-lg text-xs"
          >
            Give Feedback
          </a>
        </div>
        {/* <div className={classNames(hideNav && "hidden")}>
          <RadioPicker
            key={String(route)}
            type="transparent"
            handleChange={(next) => {
              setRoute(next);
            }}
            defaultValue={route}
            options={[
              { label: "Your Feed", value: RouteOption.FEED },
              { label: "Explore", value: RouteOption.EXPLORE },
            ]}
          />
        </div> */}
      </div>
      {mode}
    </div>
  );
};

const FeedShell = ({
  left,
  right,
  showRight,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  showRight?: boolean;
}) => {
  const skipToContentId = "main-content";
  const ContainerComponent = showRight ? Grid : Container;
  const backgroundTheme =
    "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)";
  const backgroundThemeMuted =
    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0vh, rgba(0,0,0,0.2) 100vh)";

  const screenCentered =
    "flex min-h-screen min-w-full flex-col items-center lg:justify-center";

  return (
    <Container className="select-none">
      <a
        className="bg-primary text-primary-content absolute left-0 z-10 m-3 -translate-y-16 p-3 transition focus:translate-y-0"
        href={`#${skipToContentId}`}
      >
        Skip To Content
      </a>
      <Container
        style={{
          background: backgroundTheme as StyleHack,
        }}
        className={classNames(screenCentered)}
      >
        <PWAInstall />
        <ContainerComponent className="flex h-full w-full flex-1 flex-col">
          <aside
            className={classNames(
              "via-opacity-30 flex h-full flex-1 flex-col text-left",
              !showRight && "items-center lg:justify-center",
              !showRight && "pb-5",
            )}
            style={
              !showRight
                ? {
                    background: backgroundThemeMuted as StyleHack,
                  }
                : {}
            }
          >
            <div className="lg:px-3">{left}</div>
          </aside>
          {showRight && (
            <main id={skipToContentId} className="h-full">
              <div className="mx-3">{right}</div>
            </main>
          )}
        </ContainerComponent>
      </Container>
    </Container>
  );
};

export const Feed = (props: FeedProps) => {
  const [showOfficeModal, setShowOfficeModal] = React.useState(false);

  const showAllReps = () => {
    setShowOfficeModal(true);
  };

  const location = getLocation(props.filters.location);
  const introMode = props.globalState.route === RouteOption.INTRO;

  return (
    <>
      {props.offices && showOfficeModal ? (
        <Modal
          isOpen={showOfficeModal}
          onClose={() => setShowOfficeModal(false)}
        >
          <div className="flex w-full max-w-2xl flex-col gap-y-5 justify-self-center">
            <div className="text-center text-lg font-light">
              Representatives for {location}.
            </div>
            <RepresentativesList officialOffice={props.offices} />
          </div>
        </Modal>
      ) : (
        <FeedShell
          left={<Navigation {...props} showAllReps={showAllReps} />}
          right={<FeedBills {...props} />}
          showRight={!introMode}
        />
      )}
    </>
  );
};
