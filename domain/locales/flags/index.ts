import ChicagoFlag from "./chicago.svg";
import IllinoisFlag from "./il.svg";
import USAFlag from "./usa.svg";
import { SupportedLocale } from "..";

export const getFlagIcon = (locale: SupportedLocale) => {
  switch (locale) {
    case SupportedLocale.USA:
      return USAFlag;
    case SupportedLocale.Illinois:
      return IllinoisFlag;
    case SupportedLocale.Chicago:
      return ChicagoFlag;
  }
};
