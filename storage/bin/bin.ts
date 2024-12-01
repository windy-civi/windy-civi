#! /usr/bin/env node
import path from "path";
import { downloadAll } from "../utils/download-all";

type SaveAllParams = Parameters<typeof downloadAll>;

const getCommandArg = () => {
  const firstArg = process.argv[2];
  if (["cache", "ghrelease"].includes(firstArg)) {
    console.error("first argument must be cache or ghrelease");
    process.exit(1);
  }

  return firstArg as SaveAllParams[0];
};

const getCacheDir = () =>
  path.join(
    process.cwd(),
    process.argv[3] || "legislation_dist"
  ) as SaveAllParams[1];

downloadAll(getCommandArg(), getCacheDir());
