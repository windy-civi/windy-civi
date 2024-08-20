import { Locales, locales } from "./types";

export const isLocale = (locale: unknown): locale is Locales =>
  typeof locale === "string" && locales.includes(locale as Locales);

export const forEachLocale = (
  cb: (l: Locales) => void,
  locale?: Locales
): Error | null => {
  if (locale) {
    cb(locale);
  } else {
    for (const locale of locales) {
      cb(locale);
    }
  }
  return null;
};
