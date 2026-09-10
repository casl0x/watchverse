"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Clock, Layers, ListChecks, Search } from "lucide-react";
import type { Watchlist } from "@/types";
import { useWatchedProgress } from "@/hooks/useWatchedProgress";
import { formatHoursLabel, getTotalMinutes } from "@/lib/api";
import WatchlistCard from "./WatchlistCard";

export default function WatchlistsGrid({
  watchlists,
}: {
  watchlists: Watchlist[];
}) {
  const [query, setQuery] = useState("");
  const { hydrated, getProgress } = useWatchedProgress();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return watchlists;
    return watchlists.filter(
      (wl) =>
        wl.name.toLowerCase().includes(q) ||
        (wl.description ?? "").toLowerCase().includes(q),
    );
  }, [watchlists, query]);

  const totalTitles = useMemo(
    () => watchlists.reduce((sum, wl) => sum + wl.items.length, 0),
    [watchlists],
  );
  const totalMinutes = useMemo(
    () => watchlists.reduce((sum, wl) => sum + getTotalMinutes(wl.items), 0),
    [watchlists],
  );

  const globalProgress = useMemo(() => {
    if (!hydrated) return { done: 0, total: totalTitles, pct: 0 };
    let done = 0;
    for (const wl of watchlists) done += getProgress(wl.id, wl.items).done;
    const pct = totalTitles === 0 ? 0 : Math.round((done / totalTitles) * 100);
    return { done, total: totalTitles, pct };
  }, [hydrated, watchlists, totalTitles, getProgress]);

  return (
    <main className="min-h-screen bg-wv-bg text-wv-text">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              Watchlists
            </h1>
            <p className="mt-2 max-w-xl text-sm text-wv-text2">
              Des sélections organisées, à votre rythme. Cochez ce que vous
              avez déjà vu et suivez votre progression.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wv-text3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une watchlist..."
              className="w-full rounded-lg border border-wv-border bg-wv-surface py-2 pl-9 pr-3 text-sm text-wv-text placeholder:text-wv-text3 outline-none transition focus-visible:border-wv-accent focus-visible:ring-2 focus-visible:ring-wv-accent/30"
            />
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            icon={<Layers className="h-4 w-4" />}
            label="Watchlists"
            value={watchlists.length}
          />
          <StatTile
            icon={<ListChecks className="h-4 w-4" />}
            label="Titres"
            value={totalTitles}
          />
          <StatTile
            icon={<Clock className="h-4 w-4" />}
            label="Durée totale"
            value={formatHoursLabel(totalMinutes)}
          />
          <StatTile
            label="Progression"
            value={hydrated ? `${globalProgress.pct}%` : "—"}
          />
        </dl>

        {hydrated && globalProgress.done > 0 && (
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-wv-surface2">
              <div
                className="h-full rounded-full bg-wv-accent transition-[width] duration-300"
                style={{ width: `${globalProgress.pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-wv-text3">
              {globalProgress.done} / {globalProgress.total} titres vus au
              total
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {filtered.length === 0 ? (
          <p className="rounded-lg border border-wv-border bg-wv-surface px-4 py-10 text-center text-sm text-wv-text2">
            {watchlists.length === 0
              ? "Aucune watchlist disponible pour le moment."
              : `Aucune watchlist ne correspond à « ${query} ».`}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((wl) => (
              <WatchlistCard
                key={wl.id}
                watchlist={wl}
                progress={
                  hydrated
                    ? getProgress(wl.id, wl.items)
                    : { total: wl.items.length, done: 0, pct: 0 }
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-heading text-xl font-semibold text-wv-text">
          Questions fréquentes
        </h2>
        <div className="mt-4 divide-y divide-wv-border rounded-lg border border-wv-border bg-wv-surface">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-wv-text [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-accent/40">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-wv-text3 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-wv-text2">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Comment fonctionne le suivi de progression ?",
    answer:
      "Ta progression est enregistrée directement dans ton navigateur, sans compte à créer. Elle reste donc propre à cet appareil : si tu changes de navigateur ou d'appareil, ou si tu vides les données de navigation, elle repart à zéro.",
  },
  {
    question: "Que signifie le badge ★ Essentiel ?",
    answer:
      "Il indique les titres incontournables pour suivre l'histoire principale d'une watchlist. Les titres Recommandé ou Optionnel apportent du contexte mais peuvent être passés si tu es pressé.",
  },
  {
    question: "Que veut dire « Saison 1 » ou « Ép. 1 à 3 » à côté d'un titre ?",
    answer:
      "Certaines watchlists suivent un ordre chronologique précis et ne recommandent qu'une partie d'une série (une saison ou une plage d'épisodes) plutôt que la série entière.",
  },
  {
    question: "Comment trier ou filtrer les titres d'une watchlist ?",
    answer:
      "Sur la page d'une watchlist, utilise les filtres Type / Statut / Importance dans le menu latéral, et le bouton « Trier » pour alterner entre l'ordre recommandé, l'ordre alphabétique et l'année.",
  },
  {
    question: "Comment sont choisies les watchlists ?",
    answer:
      "Elles sont sélectionnées et mises à jour manuellement par l'équipe WatchVerse.",
  },
];

function StatTile({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-wv-border bg-wv-surface px-4 py-3">
      <div className="flex items-center gap-1.5 text-wv-text3">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 font-heading text-xl font-semibold text-wv-text">
        {value}
      </p>
    </div>
  );
}
