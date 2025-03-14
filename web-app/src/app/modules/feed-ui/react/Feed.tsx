import React from "react";
import { PWAInstall } from "~app/modules/app-shell/PwaInstaller";
import type { StyleHack } from "~app/modules/design-system";
import { Container, Grid, classNames } from "~app/modules/design-system";
import { Logo } from "~app/modules/design-system/Logo/Logo";
import { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { FeedBills } from "./Bills";
import { YourFilterSummary } from "./Filters";

const Navigation = (props: FeedFilterProps) => {
  return (
    <HeaderScrollContainer>
      <Logo />
      <span className="opacity-60">⚙</span>
      <GiveFeedback />
      <YourFilterSummary {...props} />
    </HeaderScrollContainer>
  );
};

const HeaderScrollContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        "flex",
        "flex-row lg:flex-col",
        "items-center lg:items-start",
        "overflow-x-auto lg:overflow-x-hidden",
        "gap-1",
        "whitespace-nowrap",
        "px-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

const FeedShell = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  const ContainerComponent = Grid;
  const backgroundTheme =
    "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)";
  // const backgroundThemeMuted =
  //   "linear-gradient(to bottom, rgba(0,0,0,0.3) 0vh, rgba(0,0,0,0.2) 100vh)";

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
            )}
          >
            <div className="lg:px-3">{left}</div>
          </aside>
          <main id={skipToContentId} className="h-full">
            <div className="mx-3">{right}</div>
          </main>
        </ContainerComponent>
      </Container>
    </Container>
  );
};

const GiveFeedback = () => {
  return (
    <div className="mb-2 flex items-center px-3 pt-3">
      <a
        href="#/help"
        className="uppercase font-bold text-white bg-black bg-opacity-40 py-1 px-2 rounded cursor-pointer hover:shadow-lg text-xs"
      >
        Give Feedback
      </a>
    </div>
  );
};

export const Feed = (props: FeedProps) => {
  return (
    <>
      <FeedShell
        left={<Navigation {...props} />}
        right={<FeedBills {...props} />}
      />
    </>
  );
};
