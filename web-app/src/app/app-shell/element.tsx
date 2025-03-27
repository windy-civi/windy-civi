import { Outlet, NavLink, useLoaderData, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { StyleHack, classNames } from "../design-system/styles";
import { Feed } from "../feed/element";
import { FaGear } from "react-icons/fa6";
import { AppShellLoaderData } from "./types";
import { AppProvider } from "./context";
import { Logo } from "../design-system/Icons";
import { FaCode, FaHeart } from "react-icons/fa";
import { getFlagIcon } from "@windy-civi/domain/locales/flags";
import {
  isSupportedLocale,
  SupportedLocale,
  getLocaleGradient,
} from "@windy-civi/domain/locales";
import { isSupportedTag, TagMap } from "@windy-civi/domain/tags";
import { useHandleNativeBridgeMessage } from "../utils/useHandleNativeBridgeMessage";

// Add this new component before the Navigation component
const FeedNavItem = ({ href, name }: { href: string; name: string }) => {
  if (name === "For You") {
    return <NavItem key={href} href={href} name={name} icon={<FaHeart />} />;
  }

  if (name === "USA Trending") {
    return (
      <NavItem
        key={href}
        href={href}
        name={name}
        icon={
          <div className="w-5">
            <img className="h-4 w-4" src={getFlagIcon(SupportedLocale.USA)} />
          </div>
        }
      />
    );
  }

  if (isSupportedLocale(name)) {
    return (
      <NavItem
        key={href}
        href={href}
        name={name}
        icon={
          <div className="w-5">
            <img className="h-4" src={getFlagIcon(name)} />
          </div>
        }
      />
    );
  }

  if (isSupportedTag(name)) {
    return (
      <NavItem
        key={href}
        href={href}
        name={name}
        icon={<span>{TagMap[name].icon}</span>}
      />
    );
  }

  return <NavItem key={href} href={href} name={name} />;
};

const NavItem = ({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon?: JSX.Element;
}) => {
  return (
    <div className="flex self-stretch">
      <NavLink
        className={({ isActive }) =>
          classNames(
            "uppercase font-bold py-1 px-2 rounded cursor-pointer hover:shadow-lg text-xs flex items-center self-stretch",
            isActive
              ? "text-black text-opacity-90 bg-white bg-opacity-60"
              : "text-white bg-black bg-opacity-40",
          )
        }
        to={href}
      >
        <div className="flex flex-row items-center gap-2">
          {icon}
          <div>{name}</div>
        </div>
      </NavLink>
    </div>
  );
};

const capitalizeWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

const kebabToTitle = (text: string): string => {
  if (!text) return "";
  return text.split("-").map(capitalizeWord).join(" ");
};

const getLastPathSegment = (path: string): string => {
  const segments = path.split("/");
  return segments[segments.length - 1];
};

const getDisplayName = (name: string): string => {
  if (name === "/@you") return "Your Feed";
  return kebabToTitle(getLastPathSegment(name));
};

// Add a new component for dynamic community routes
export const CommunityRoute = () => {
  // const result = useLoaderData() as FeedProps;
  const { pathname } = useLocation();
  const name = pathname;

  const displayName = getDisplayName(name);
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">{displayName}</h1>
      <Feed />
    </div>
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
        "items-stretch",
        "overflow-x-auto",
        "xl:justify-center",
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

export const NavigatorShell = ({
  navigation,
  feed,
}: {
  navigation: React.ReactNode;
  feed: React.ReactNode;
}) => {
  const skipToContentId = "main-content";
  const { pathname } = useLocation();

  const getBackgroundTheme = () => {
    // Extract locale from pathname
    const locale = pathname.replace("/", "") as SupportedLocale;
    return getLocaleGradient(locale, pathname);
  };

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
          background: getBackgroundTheme() as StyleHack,
        }}
        className={classNames(screenCentered)}
      >
        <div className="flex h-full w-full flex-1 flex-col">
          <header
            className={classNames(
              "fixed top-0 left-0 right-0 z-10 backdrop-blur-3xl w-full",
              // There is a weird bug in iOS where the blur doesn't work while scrolling
              // but it only happens on select backgrounds. 🤷
              isWebview() && "bg-white bg-opacity-50",
            )}
          >
            {navigation}
          </header>
          <main
            id={skipToContentId}
            className="h-full w-full flex justify-center mt-14"
          >
            <div className="mx-3 md:max-w-prose">{feed}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const Navigation = (props: AppShellLoaderData) => {
  return (
    <HeaderScrollContainer>
      <Logo />
      <NavItem href="/preferences" name="Preferences" icon={<FaGear />} />
      {/* Adds links for feeds based on user preferences */}
      {props.availableFeeds.map(({ href, name }) => (
        <FeedNavItem key={href} href={href} name={name} />
      ))}
    </HeaderScrollContainer>
  );
};

export function AppShell() {
  const result = useLoaderData() as AppShellLoaderData;

  const { handleNativeBridgeMessage } = useHandleNativeBridgeMessage(
    (status) => {
      // Handle notification status updates
      alert(`${status} is the status`);
    },
    (error) => {
      // Handle native bridge errors
      alert(`${error} is the error`);
    },
  );

  useEffect(() => {
    window.addEventListener("message", handleNativeBridgeMessage);
    return () =>
      window.removeEventListener("message", handleNativeBridgeMessage);
  }, [handleNativeBridgeMessage]);

  return (
    <AppProvider value={result.env}>
      <NavigatorShell
        navigation={<Navigation {...result} />}
        feed={<Outlet />}
      />
    </AppProvider>
  );
}

const isWebview = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const navigator = window.navigator;

  // Check if running in standalone mode (added to home screen)
  const standalone = "standalone" in navigator;
  const userAgent = navigator.userAgent.toLowerCase();
  const safari = /safari/.test(userAgent);
  const ios = /iphone|ipod|ipad/.test(userAgent);

  return ios ? !standalone && !safari : /\bwv\b/.test(userAgent);
};
