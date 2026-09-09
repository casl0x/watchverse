export type ItemType = "movie" | "tv" | "special";
export type Importance = "essential" | "recommended" | "optional";

export interface WatchItem {
  id: string;
  title: string;
  type: ItemType;
  importance: Importance;
  year?: number | null;
  duration?: number | null; // minutes
  platform?: string | null;
  poster_url?: string | null;
  order?: number;
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
