"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { WatchedMap, WatchItem } from "@/types";

const STORAGE_KEY = "watchverse_progress";

// Sentinel reference returned during SSR / before hydration, so we can tell
// "no data yet" apart from "hydrated, and genuinely empty".
const SERVER_SNAPSHOT: WatchedMap = {};

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: WatchedMap | null = null;

function readStorage(): WatchedMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WatchedMap) : {};
  } catch {
    return {};
  }
}

function writeStorage(map: WatchedMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.)
  }
}

function getSnapshot(): WatchedMap {
  if (cache === null) cache = readStorage();
  return cache;
}

function getServerSnapshot(): WatchedMap {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = readStorage();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function updateWatched(updater: (prev: WatchedMap) => WatchedMap) {
  const next = updater(getSnapshot());
  cache = next;
  writeStorage(next);
  for (const listener of listeners) listener();
}

export function useWatchedProgress() {
  // Reads localStorage on the client only; SSR and the first hydration pass
  // both see SERVER_SNAPSHOT, so there is no hydration mismatch, and React
  // re-renders automatically once the real client snapshot is available.
  const watched = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = watched !== SERVER_SNAPSHOT;

  const isWatched = useCallback(
    (watchlistId: string, itemId: string) => !!watched[watchlistId]?.[itemId],
    [watched],
  );

  const toggle = useCallback((watchlistId: string, itemId: string) => {
    updateWatched((prev) => {
      const list = { ...(prev[watchlistId] ?? {}) };
      if (list[itemId]) {
        delete list[itemId];
      } else {
        list[itemId] = true;
      }
      return { ...prev, [watchlistId]: list };
    });
  }, []);

  const markAll = useCallback(
    (watchlistId: string, itemIds: string[], value: boolean) => {
      updateWatched((prev) => {
        const list = { ...(prev[watchlistId] ?? {}) };
        for (const id of itemIds) {
          if (value) list[id] = true;
          else delete list[id];
        }
        return { ...prev, [watchlistId]: list };
      });
    },
    [],
  );

  const getProgress = useCallback(
    (watchlistId: string, items: WatchItem[]) => {
      const total = items.length;
      const list = watched[watchlistId];
      const done = list
        ? items.reduce((n, item) => n + (list[item.id] ? 1 : 0), 0)
        : 0;
      const pct = total === 0 ? 0 : Math.round((done / total) * 100);
      return { total, done, pct };
    },
    [watched],
  );

  return { hydrated, isWatched, toggle, markAll, getProgress };
}
