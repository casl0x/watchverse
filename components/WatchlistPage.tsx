"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Film,
  ListChecks,
  Search,
  Sparkles,
  Star,
  Tv,
} from "lucide-react";
import type { Importance, ItemType, Watchlist } from "@/types";
import { useWatchedProgress } from "@/hooks/useWatchedProgress";
import { formatHoursLabel, formatItemDuration, getTotalMinutes } from "@/lib/api";

type SortMode = "order" | "az" | "year";
type StatusFilter = "all" | "watched" | "unwatched";
type TypeFilter = "all" | ItemType;
type ImportanceFilter = "all" | Importance;

const TYPE_LABELS: Record<ItemType, string> = {
  movie: "Film",
  tv: "Série",
  special: "Spécial",
};

const TYPE_ICONS: Record<ItemType, typeof Film> = {
  movie: Film,
  tv: Tv,
  special: Sparkles,
};

const SORT_LABELS: Record<SortMode, string> = {
  order: "Ordre",
  az: "A→Z",
  year: "Année",
};

const SORT_CYCLE: SortMode[] = ["order", "az", "year"];

export default function WatchlistPage({ watchlist }: { watchlist: Watchlist }) {
  const { hydrated, isWatched, toggle, markAll, getProgress } =
    useWatchedProgress();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [importanceFilter, setImportanceFilter] =
    useState<ImportanceFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("order");

  const progress = getProgress(watchlist.id, watchlist.items);
  const essentialCount = useMemo(
    () => watchlist.items.filter((item) => item.importance === "essential").length,
    [watchlist.items],
  );
  const totalMinutes = useMemo(
    () => getTotalMinutes(watchlist.items),
    [watchlist.items],
  );
  const allWatched = hydrated && progress.total > 0 && progress.done === progress.total;

  const visibleItems = useMemo(() => {
    let list = watchlist.items;

    if (typeFilter !== "all") {
      list = list.filter((item) => item.type === typeFilter);
    }
    if (importanceFilter !== "all") {
      list = list.filter((item) => item.importance === importanceFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((item) => {
        const watched = hydrated && isWatched(watchlist.id, item.id);
        return statusFilter === "watched" ? watched : !watched;
      });
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sortMode === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    } else if (sortMode === "year") {
      sorted.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity));
    } else {
      sorted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return sorted;
  }, [
    watchlist.id,
    watchlist.items,
    typeFilter,
    importanceFilter,
    statusFilter,
    query,
    sortMode,
    hydrated,
    isWatched,
  ]);

  function cycleSort() {
    const idx = SORT_CYCLE.indexOf(sortMode);
    setSortMode(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length]);
  }

  return (
    <main className="min-h-screen bg-wv-bg text-wv-text">
      <div className="sticky top-0 z-20 border-b border-wv-border bg-wv-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <Link
            href="/watchlists"
            className="inline-flex items-center gap-1.5 rounded text-sm text-wv-text2 transition hover:text-wv-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les watchlists
          </Link>

          <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-4">
            <StatItem label="Titres totaux" value={progress.total} />
            <StatItem label="Vus" value={hydrated ? progress.done : "—"} accent />
            <StatItem
              label="Restants"
              value={hydrated ? progress.total - progress.done : "—"}
            />
            <StatItem label="Essentiels" value={essentialCount} />
            <StatItem label="Durée totale" value={formatHoursLabel(totalMinutes)} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[112px] space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: watchlist.color }}
                  />
                  <h1 className="font-heading text-xl font-semibold text-wv-text">
                    {watchlist.name}
                  </h1>
                </div>
                {watchlist.description && (
                  <p className="mt-2 text-sm text-wv-text2">
                    {watchlist.description}
                  </p>
                )}
              </div>

              <FilterGroup
                label="Type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                  { value: "all", label: "Tous" },
                  { value: "movie", label: "Film" },
                  { value: "tv", label: "Série" },
                  { value: "special", label: "Spécial" },
                ]}
              />
              <FilterGroup
                label="Statut"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "Tous" },
                  { value: "unwatched", label: "Non vus" },
                  { value: "watched", label: "Vus" },
                ]}
              />
              <FilterGroup
                label="Importance"
                value={importanceFilter}
                onChange={setImportanceFilter}
                options={[
                  { value: "all", label: "Toutes" },
                  { value: "essential", label: "★ Essentiel" },
                  { value: "recommended", label: "Recommandé" },
                  { value: "optional", label: "Optionnel" },
                ]}
              />
            </div>
          </aside>

          <div>
            <div className="mb-4 lg:hidden">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: watchlist.color }}
                />
                <h1 className="font-heading text-xl font-semibold text-wv-text">
                  {watchlist.name}
                </h1>
              </div>
              {watchlist.description && (
                <p className="mt-1 text-sm text-wv-text2">
                  {watchlist.description}
                </p>
              )}
            </div>

            <div className="sticky top-[112px] z-10 rounded-lg border border-wv-border bg-wv-surface px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-wv-text2">
                  {visibleItems.length} titre{visibleItems.length > 1 ? "s" : ""}
                </span>

                <div className="relative min-w-[160px] flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wv-text3" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un titre..."
                    className="w-full rounded-lg border border-wv-border bg-wv-surface2 py-1.5 pl-9 pr-3 text-sm text-wv-text placeholder:text-wv-text3 outline-none transition focus-visible:border-wv-accent focus-visible:ring-2 focus-visible:ring-wv-accent/30"
                  />
                </div>

                <button
                  type="button"
                  onClick={cycleSort}
                  className="rounded-lg border border-wv-border bg-wv-surface2 px-3 py-1.5 text-sm text-wv-text2 transition hover:text-wv-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40"
                >
                  Trier : {SORT_LABELS[sortMode]}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    markAll(
                      watchlist.id,
                      watchlist.items.map((item) => item.id),
                      !allWatched,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-wv-border bg-wv-surface2 px-3 py-1.5 text-sm text-wv-text2 transition hover:text-wv-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40"
                >
                  <ListChecks className="h-4 w-4" />
                  {allWatched ? "Tout décocher" : "Tout cocher"}
                </button>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-wv-surface2">
                  <div
                    className="h-full rounded-full bg-wv-accent transition-[width] duration-300"
                    style={{ width: `${hydrated ? progress.pct : 0}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-wv-text3">
                  {hydrated ? progress.pct : 0}% · {hydrated ? progress.done : 0}/
                  {progress.total} vus
                </p>
              </div>
            </div>

            <ul className="mt-2 divide-y divide-wv-border">
              {visibleItems.map((item, index) => {
                const watched = hydrated && isWatched(watchlist.id, item.id);
                const TypeIcon = TYPE_ICONS[item.type];
                const meta = [
                  item.year ?? null,
                  formatItemDuration(item.duration),
                  item.platform ?? null,
                ].filter(Boolean);

                return (
                  <li
                    key={item.id}
                    className={`flex items-center gap-3 py-3 transition-opacity ${
                      watched ? "opacity-50" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(watchlist.id, item.id)}
                      aria-pressed={watched}
                      aria-label={
                        watched
                          ? `Marquer "${item.title}" comme non vu`
                          : `Marquer "${item.title}" comme vu`
                      }
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40 ${
                        watched
                          ? "border-wv-watched bg-wv-watched text-wv-bg"
                          : "border-wv-border text-wv-text3 hover:border-wv-accent hover:text-wv-accent"
                      }`}
                    >
                      {watched ? <Check className="h-4 w-4" /> : index + 1}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium text-wv-text">
                          {item.title}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-wv-border px-1.5 py-0.5 text-[11px] text-wv-text3">
                          <TypeIcon className="h-3 w-3" />
                          {TYPE_LABELS[item.type]}
                        </span>
                        {item.importance === "essential" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-wv-gold/40 bg-wv-gold/10 px-1.5 py-0.5 text-[11px] text-wv-gold">
                            <Star className="h-3 w-3" />
                            Essentiel
                          </span>
                        )}
                      </div>
                      {meta.length > 0 && (
                        <p className="mt-0.5 text-xs text-wv-text3">
                          {meta.join(" · ")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}

              {visibleItems.length === 0 && (
                <li className="py-10 text-center text-sm text-wv-text2">
                  Aucun titre ne correspond à ces filtres.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[9px] uppercase tracking-wide text-wv-text3 sm:text-[11px]">
        {label}
      </p>
      <p
        className={`font-heading text-sm font-semibold sm:text-lg ${
          accent ? "text-wv-watched" : "text-wv-text"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-wv-text3">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`rounded-full border px-2.5 py-1 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40 ${
              value === opt.value
                ? "border-wv-accent bg-wv-accent/15 text-wv-accent2"
                : "border-wv-border text-wv-text2 hover:border-wv-accent/50 hover:text-wv-text"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
