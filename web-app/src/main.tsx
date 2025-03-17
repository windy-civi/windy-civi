import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import AppProvider from "./app/app-shell/AppProvider";
import { getEnv } from "./app/config";
import { loader } from "./app/navigator/loader";
import { Navigator } from "./app/navigator/element";
import { Support } from "./app/support/Support";
import { Preferences } from "./app/preferences/element";
import { loader as preferencesLoader } from "./app/preferences/loader";
import { action as preferencesAction } from "./app/preferences/action";

/**
 * Load tailwind
 */
import { Feed } from "./app/feed/element";
import "./tailwind-install.css";

const router = createHashRouter([
  {
    path: "/",
    loader,
    element: <Navigator />,
    children: [
      {
        path: "/",
        loader,
        element: <Feed />,
      },
      {
        path: "/help",
        element: <Support />,
      },
      {
        path: "/preferences",
        loader: preferencesLoader,
        action: preferencesAction,
        element: <Preferences />,
      },
    ],
  },
]);

const env = getEnv(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <AppProvider value={env}>
    <RouterProvider router={router} />
  </AppProvider>,
);
