import type { Spacing, ZIndex, Skin } from "./enums";
import type CSSType from "csstype";

/**
 * CSS Properties with added restrictions
 */
interface RestrictedCSSProperties extends CSSType.Properties {
  // Structure
  padding?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  paddingRight?: Spacing;
  paddingLeft?: Spacing;

  margin?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginRight?: Spacing;
  marginLeft?: Spacing;

  zIndex?: ZIndex;

  // Skins
  color?: Skin;
  backgroundColor?: Skin;
  background?: Skin;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Style {
  export type Properties = RestrictedCSSProperties;
  export type StyleSheet<T extends string> = Record<T, Properties>;
}

/**
 * Allows for adding style hacks while having a convention that documents hacks
 */
export type StyleHack = any;
