export interface PreferencesLoaderData {
  darkMode: boolean;
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
  };
  language: string;
}
