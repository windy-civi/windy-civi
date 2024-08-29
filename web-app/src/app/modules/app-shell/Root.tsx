import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getEnv } from "~app/modules/config";
import AppProvider from "./AppProvider";
import type { Config } from "./types";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "css/main.css" },
    { rel: "stylesheet", href: "css/tailwind.css" },
    { rel: "manifest", href: "windycivi.webmanifest" },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Windy Civi",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const env = getEnv(process.env);
  const apiKey = env.GOOGLE_API_KEY;
  return json<Config>({
    apiKey,
  });
};

export const unstable_shouldReload = () => false;

export default function App() {
  const data = useLoaderData<Config>();

  return (
    <html lang="en" className="h-full" data-theme="light">
      <Meta />
      <head>
        <Links />
      </head>
      <body>
        <AppProvider value={data}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
