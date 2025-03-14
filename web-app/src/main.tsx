import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import AppProvider from "./app/app-shell/AppProvider";
import { getEnv } from "./app/config";
import { ForYouPage } from "./app/feed-ui/feed-ui.react";
import { Support } from "./app/support/Support";
import { loader } from "./app/feed-ui/feed-ui.loader";

/**
 * Load tailwind
 */
import "./tailwind-install.css";

const router = createHashRouter([
  {
    path: "/",
    loader,
    element: <ForYouPage />,
  },
  {
    path: "/help",
    element: <Support />,
  },
]);

const env = getEnv(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <AppProvider value={env}>
    <RouterProvider router={router} />
  </AppProvider>,
);
