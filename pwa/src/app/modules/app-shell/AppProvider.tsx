import type { FC } from "react";
import AppContext from "./AppContext";
import { Env } from "../config";

const AppProvider: FC<{ value: Env; children: React.ReactNode }> = ({
  children,
  value,
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
