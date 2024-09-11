export type Env = {
  GOOGLE_API_KEY: string;
};

export const getEnv = (env: ImportMetaEnv): Env => {
  return {
    GOOGLE_API_KEY: env.VITE_GOOGLE_API_KEY,
  };
};
