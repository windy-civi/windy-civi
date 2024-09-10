/**
 * mainly to cache legislation data retrieved from legiscan and councilmatic
 */

import LRUCache from "lru-cache";

const opts = {
  max: 500,
  // cache for 2 hours
  ttl: 1000 * 60 * 60 * 2,
  allowStale: false,
};

// HACK: Remix in dev reloads the require cache, making memory saving complicated.
// https://stackoverflow.com/questions/72661999/how-do-i-use-in-memory-cache-in-remix-run-dev-mode

let legislationCache: LRUCache<string, unknown>;

declare global {
  var __legislationCache: LRUCache<string, unknown> | undefined;
}

if (process.env.NODE_ENV === "production") {
  legislationCache = new LRUCache(opts);
} else {
  if (!global.__legislationCache) {
    global.__legislationCache = new LRUCache(opts);
  }
  legislationCache = global.__legislationCache;
}

export { legislationCache };
