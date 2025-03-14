import React from "react";
import { PWAInstall } from "../../app-shell/PwaInstaller";
import { Logo, StyleHack, classNames } from "../../design-system";
import { FeedFilterProps, FeedProps } from "../feed-ui.types";
import { FeedBills } from "./Bills";
import { TagNavigation } from "./Filters";

const Navigation = (props: FeedFilterProps) => {
  return (
    <HeaderScrollContainer>
      <Logo />
      <Preferences />
      <NavButton href="#/help">Give Feedback</NavButton>
      <TagNavigation {...props} />
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
        "flex-row",
        "items-center",
        "overflow-x-auto",
        "gap-3",
        "whitespace-nowrap",
        "px-5",
        "py-2",
        className,
      )}
    >
      {children}
    </div>
  );
};

const FeedShell = ({
  navigation,
  feed,
}: {
  navigation: React.ReactNode;
  feed: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  const backgroundTheme =
    "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)";
  // const backgroundThemeMuted =
  //   "linear-gradient(to bottom, rgba(0,0,0,0.3) 0vh, rgba(0,0,0,0.2) 100vh)";

  const screenCentered =
    "flex min-h-screen min-w-full flex-col items-center lg:justify-center";

  return (
    <div className="select-none">
      <a
        className="bg-primary text-primary-content absolute left-0 z-10 m-3 -translate-y-16 p-3 transition focus:translate-y-0"
        href={`#${skipToContentId}`}
      >
        Skip To Content
      </a>
      <div
        style={{
          background: backgroundTheme as StyleHack,
        }}
        className={classNames(screenCentered)}
      >
        <PWAInstall />
        <div className="flex h-full w-full flex-1 flex-col">
          <header>{navigation}</header>
          <main
            id={skipToContentId}
            className="h-full w-full flex justify-center"
          >
            <div className="mx-3 lg:max-w-prose">{feed}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const Preferences = () => {
  return <NavButton href="#/preferences">⚙ Preferences</NavButton>;
};

const NavButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center">
      <a
        href={href}
        className="uppercase font-bold text-white bg-black bg-opacity-40 py-1 px-2 rounded cursor-pointer hover:shadow-lg text-xs"
      >
        {children}
      </a>
    </div>
  );
};

export const Feed = (props: FeedProps) => {
  return (
    <>
      <FeedShell
        navigation={<Navigation {...props} />}
        feed={<FeedBills {...props} />}
      />
    </>
  );
};
