export enum MediaQueries {
  "sm" = "media (min-width: 640px)",
  "md" = "media (min-width: 768px)",
  "lg" = "media (min-width: 1024px)",
  "xl" = "media (min-width: 1280px)",
  "2xl" = "media (min-width: 1536px)",
}

export enum Spacing {
  ZERO = "0",
  ONE = "5px",
  TWO = "10px",
  THREE = "15px",
  FOUR = "20px",
  AUTO = "auto",
}

export enum ZIndex {
  "z-index-1" = 1,
  "z-index-2" = 2,
  "z-index-3" = 3,
  "z-index-4" = 4,
}

export enum Skin {
  PrimaryPink = "#ff277e",

  Black = "#000000",
  White = "#FFFFFF",
}

export const StyleHelpers = {
  ZIndex,
  Spacing,
};
