import { Env } from "@windycivi/domain/types";

export const getEnv = (env: ImportMetaEnv): Env => {
  return {
    GOOGLE_API_KEY: env.VITE_GOOGLE_API_KEY,
  };
};
