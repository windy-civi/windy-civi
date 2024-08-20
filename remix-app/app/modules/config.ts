import invariant from "tiny-invariant";
import ENVIRONMENT_VARIABLES from "../../setup-scripts/env";

export type Env = {
  [K in typeof ENVIRONMENT_VARIABLES[number]]: string;
};

export const getEnv = (processEnv: typeof process.env): Env => {
  return ENVIRONMENT_VARIABLES.reduce((env, e) => {
    const value = processEnv[e];
    // verify env exists
    invariant(typeof value === "string", `⛔️ ${e} env var not set.`);
    env[e] = value;
    return env;
  }, {} as Env);
};
