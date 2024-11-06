import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppProvider from "~app/modules/app-shell/AppProvider";
import { getEnv } from "~app/modules/config";
import { ForYouPage } from "~app/modules/feed-ui/feed-ui.react";
import { loader } from "./app/modules/feed-ui/feed-ui.loader";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    loader,
    element: <ForYouPage />,
  },
]);

const env = getEnv(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <AppProvider value={env}>
    <RouterProvider router={router} />
  </AppProvider>,
);
