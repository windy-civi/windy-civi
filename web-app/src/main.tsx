import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import AppProvider from "~app/modules/app-shell/AppProvider";
import { getEnv } from "~app/modules/config";
import { ForYouPage } from "~app/modules/feed-ui/feed-ui.react";
import { Support } from "~app/modules/support/Support";
import { loader } from "./app/modules/feed-ui/feed-ui.loader";
import "./index.css";

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
