import { Outlet, NavLink, useLoaderData, useLocation } from "react-router-dom";

import React from "react";
import { StyleHack, classNames } from "../design-system/styles";
import { Feed } from "../feed/element";
import { FaGear } from "react-icons/fa6";
import { AppShellLoaderData } from "./types";
import { AppProvider } from "./context";
import { Logo } from "../design-system/Icons";
import { FaCode, FaHeart } from "react-icons/fa";
import { getFlagIcon } from "@windy-civi/domain/locales/flags";
import { isSupportedLocale, SupportedLocale } from "@windy-civi/domain/locales";
import { isSupportedTag, TagMap } from "@windy-civi/domain/tags";

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
        icon={<img className="h-4" src={getFlagIcon(SupportedLocale.USA)} />}
      />
    );
  }

  if (isSupportedLocale(name)) {
    console.log("name", name, isSupportedLocale(name), getFlagIcon(name));
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
        "lg:justify-center",
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
  const defaultBackgroundTheme =
    "linear-gradient(to bottom, rgba(255,29,135,1) 0px, rgba(255,82,37,1) 600px, rgba(238,145, 126,1) 1000px, rgba(0,0,0,0.1) 1500px)";

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
          background:
            `var(--background-theme, ${defaultBackgroundTheme})` as StyleHack,
        }}
        className={classNames(screenCentered)}
      >
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

const Navigation = (props: AppShellLoaderData) => {
  return (
    <HeaderScrollContainer>
      <Logo />
      <NavItem href="/contribute" name="Contribute" icon={<FaCode />} />
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
  return (
    <AppProvider value={result.env}>
      <NavigatorShell
        navigation={<Navigation {...result} />}
        feed={<Outlet />}
      />
    </AppProvider>
  );
}
