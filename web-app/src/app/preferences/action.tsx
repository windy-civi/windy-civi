import { ActionFunction, json } from "react-router-dom";
import { FilterParams, LocationFilter } from "@windy-civi/domain/types";
import { cookieFactory } from "../feed/utils";
import { publishUserPreferences } from "../native-web-bridge/native-web-bridge";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const filters: Partial<FilterParams> = {};

  // Parse form data and update filters
  const location = formData.get("location");
  if (location) {
    filters.location = location as LocationFilter;
  }

  const tags = formData.get("tags");
  if (tags) {
    filters.tags = (tags as string).split(",");
  }

  // Save to cookies
  const cookies = cookieFactory(document);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      cookies.set(key, String(value));
    } else {
      cookies.delete(key);
    }
  });

  // Notify native app of preference changes
  publishUserPreferences({ filters: filters as FilterParams });

  return json({ success: true });
};
