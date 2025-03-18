import { Env } from "@windy-civi/domain/drivers";

export const getEnv = (
  // Don't need this, but keeping in case we need it in the future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: ImportMetaEnv,
): Env => {
  return null;
};
