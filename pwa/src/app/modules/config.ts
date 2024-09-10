import invariant from "tiny-invariant";

export type Env = {
  [k: string]: string;
};

export const getEnv = (env: ImportMetaEnv): Env => {
  return {
    GOOGLE_API_KEY: "REPLACE_THIS_TO_GOOGLE_API_KEY",
    LEGISCAN_API_KEY: "REPLACE_THIS_TO_LEGISCAN_API_KEY",
    SESSION_SECRET: "super-duper-s3cret",
    FORMATTED_ADDRESS_SEARCH_KEY: "address",
    REP_LEVEL_SEARCH_KEY: "level",
  };
};
