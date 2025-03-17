import type { LoaderFunction } from "react-router-dom";
import type { PreferencesLoaderData } from "./types";

export const loader: LoaderFunction =
  async (): Promise<PreferencesLoaderData> => {
    // TODO: In the future, this would load from a real API or local storage
    return {
      darkMode: false,
      notifications: {
        enabled: true,
        email: true,
        push: false,
      },
      language: "en",
    };
  };
