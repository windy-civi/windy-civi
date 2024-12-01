import { preferLocal } from "./utils/prefer-local-get";
import { fs as fsGet } from "./utils/fs-get";
import { fs as fsSave } from "./utils/fs-save";
import { github } from "./utils/gh-get";

export const storage = {
  preferLocal,
  github,
  fs: { ...fsGet, ...fsSave },
};
