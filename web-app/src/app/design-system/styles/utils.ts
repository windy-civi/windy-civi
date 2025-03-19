import type { Style } from "./types";

export const css = <T extends Style.Properties>(s: T): { style: T } => {
  return { style: s };
};

export const classNames = (
  ...classnames: (string | undefined | null | false)[]
) => classnames.filter(Boolean).join(" ");
