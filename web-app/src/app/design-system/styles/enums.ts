/**
 * Used in style.d.ts to define the types of the styles
 */
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
