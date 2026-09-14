export type ItemType = "movie" | "tv" | "special";
export type Importance = "essential" | "recommended" | "optional";

export interface WatchItem {
  id: string;
  title: string;
  type: ItemType;
  importance?: Importance | null;
  year?: number | null;
  duration?: number | null; // minutes
  platform?: string | null;
  poster_url?: string | null;
  order?: number;
  // Free-text pointer to a specific season/episode range within `title`,
  // e.g. "Saison 1", "Ép. 1 à 3" — for shows that are only partially
  // relevant to a watchlist's chronological order (MCU-style timelines).
  episode_label?: string | null;
}

export interface Watchlist {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  color: string; // hex
  cover_url?: string | null;
  items: WatchItem[];
}

// localStorage key: "watchverse_progress"
// shape: { [watchlistId]: { [itemId]: true } }
export type WatchedMap = Record<string, Record<string, boolean>>;
