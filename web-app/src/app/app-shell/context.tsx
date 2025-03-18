import { Env } from "@windy-civi/domain/drivers";
import { ComponentType, createContext, useContext } from "react";

const AppContext = createContext<Env | null>(null);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: ComponentType<{
  value: Env;
  children: React.ReactNode;
}> = ({ children, value }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
