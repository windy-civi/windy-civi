import ChicagoFlag from "./chicago.svg";
import IllinoisFlag from "./il.svg";
import USAFlag from "./usa.svg";
import { RepLevel } from "..";

export const getFlagIcon = (level: RepLevel) => {
  switch (level) {
    case RepLevel.National:
      return USAFlag;
    case RepLevel.State:
      return IllinoisFlag;
    case RepLevel.City:
      return ChicagoFlag;
    case RepLevel.County:
      // No specific flag for Cook County, could use a default or return null
      return null;
    default:
      return null;
  }
};
