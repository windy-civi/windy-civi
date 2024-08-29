import type { FC } from "react";
import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import type { Config } from "./types";

const AppProvider: FC<{ value: Config,  children: React.ReactNode; }> = ({ children, value }) => {
  const [config, setConfig] = useState<Config | null>(null);
  useEffect(() => {
    if (value && !config) {
      setConfig(value);
    }
  }, [config, value]);

  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};

export default AppProvider;
