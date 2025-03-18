export type Nullish = undefined | "" | null;

export const isNullish = (location: unknown | Nullish): location is Nullish => {
  return [null, "", undefined].includes(location as string | null | undefined);
};

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};

// Generated. Equal to Lodash uniqBy
export const uniqBy = <T extends object>(
  array: T[],
  keyExtractor: (item: T) => unknown
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const key = keyExtractor(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const hasOverlap = (arr1: string[], arr2: string[]): boolean => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return true;
    }
  }
  return false;
};

export const findOverlap = (arr1: string[], arr2: string[]): string | false => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return arr1[i];
    }
  }
  return false;
};

export const findStringOverlap = <T extends string>(
  arr1: readonly T[],
  arr2: readonly T[]
) => {
  const overlap = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        overlap.push(arr1[i]);
      }
    }
  }

  return overlap;
};

export const pipe = <T, R>(value: T, ...fns: Array<(arg: any) => any>): R => {
  return fns.reduce((acc, fn) => fn(acc), value as unknown) as R;
};

export const slugify = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

export const deslugify = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
