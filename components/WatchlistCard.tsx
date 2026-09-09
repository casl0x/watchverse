import Link from "next/link";
import type { CSSProperties } from "react";
import type { Watchlist } from "@/types";
import { formatHoursLabel, getTotalMinutes } from "@/lib/api";

interface Props {
  watchlist: Watchlist;
  progress: { total: number; done: number; pct: number };
}

export default function WatchlistCard({ watchlist, progress }: Props) {
  const totalMinutes = getTotalMinutes(watchlist.items);
  const style: CSSProperties & Record<"--wl-color", string> = {
    "--wl-color": watchlist.color,
  };

  return (
    <Link
      href={`/watchlists/${watchlist.slug}`}
      style={style}
      className="group block overflow-hidden rounded-lg border border-wv-border bg-wv-surface transition duration-200 hover:-translate-y-0.5 hover:border-[var(--wl-color)] focus-visible:-translate-y-0.5 focus-visible:border-[var(--wl-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40"
    >
      <div
        className="relative h-36 bg-wv-surface2 bg-cover bg-center"
        style={
          watchlist.cover_url
            ? { backgroundImage: `url(${watchlist.cover_url})` }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-wv-bg via-wv-bg/30 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-wv-border bg-wv-bg/70 px-2 py-0.5 text-xs text-wv-text2 backdrop-blur-sm">
          {watchlist.items.length} titres
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: watchlist.color }}
          />
          <h2 className="truncate font-heading text-base font-semibold text-wv-text">
            {watchlist.name}
          </h2>
        </div>

        {watchlist.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-wv-text2">
            {watchlist.description}
          </p>
        )}

        <p className="mt-3 text-xs text-wv-text3">
          {formatHoursLabel(totalMinutes)} de contenu
        </p>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-wv-surface2">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${progress.pct}%`, background: watchlist.color }}
          />
        </div>
        <p className="mt-1 text-[11px] text-wv-text3">
          {progress.done}/{progress.total} vus
        </p>
      </div>
    </Link>
  );
}
