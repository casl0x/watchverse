import type { Watchlist, WatchItem } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Mock data is used in development, and also as a fallback wherever the
// real API isn't configured yet (e.g. a preview deploy with no
// NEXT_PUBLIC_API_URL set) so builds and pages don't crash on a missing env var.
const USE_MOCK = process.env.NODE_ENV === "development" || !API_BASE;

const MOCK_WATCHLISTS: Watchlist[] = [
  {
    id: "wl-cinema-auteur",
    slug: "cinema-auteur-francais",
    name: "Cinéma d'auteur français",
    description:
      "Des perles du cinéma français contemporain et classique, choisies pour leur regard d'auteur singulier.",
    color: "#7b5cfa",
    cover_url: "https://picsum.photos/seed/wv-cinema-auteur/900/500",
    items: [
      { id: "caf-1", title: "La Haine", type: "movie", importance: "essential", year: 1995, duration: 98, platform: "Arte", order: 1 },
      { id: "caf-2", title: "Amélie Poulain", type: "movie", importance: "essential", year: 2001, duration: 122, platform: "Netflix", order: 2 },
      { id: "caf-3", title: "Portrait de la jeune fille en feu", type: "movie", importance: "essential", year: 2019, duration: 122, platform: "MUBI", order: 3 },
      { id: "caf-4", title: "Intouchables", type: "movie", importance: "recommended", year: 2011, duration: 112, platform: "Netflix", order: 4 },
      { id: "caf-5", title: "La Vie d'Adèle", type: "movie", importance: "recommended", year: 2013, duration: 180, platform: "MUBI", order: 5 },
      { id: "caf-6", title: "En thérapie", type: "tv", importance: "recommended", year: 2021, duration: 25, platform: "Arte", order: 6, episode_label: "Saison 1" },
      { id: "caf-7", title: "Au revoir les enfants", type: "movie", importance: "optional", year: 1987, duration: 104, platform: "Arte", order: 7 },
      { id: "caf-8", title: "Coup de torchon", type: "movie", importance: "optional", year: 1981, duration: 128, platform: null, order: 8 },
    ],
  },
  {
    id: "wl-sf-cultes",
    slug: "sagas-sf-cultes",
    name: "Sagas Science-Fiction cultes",
    description:
      "Les univers de science-fiction qui ont marqué le genre, du space opera au thriller spéculatif.",
    color: "#38bdf8",
    cover_url: "https://picsum.photos/seed/wv-sf-cultes/900/500",
    items: [
      { id: "sf-1", title: "Blade Runner", type: "movie", importance: "essential", year: 1982, duration: 117, platform: "Netflix", order: 1 },
      { id: "sf-2", title: "Blade Runner 2049", type: "movie", importance: "essential", year: 2017, duration: 164, platform: "Netflix", order: 2 },
      { id: "sf-3", title: "Dune", type: "movie", importance: "essential", year: 2021, duration: 155, platform: "Prime Video", order: 3 },
      { id: "sf-4", title: "Dune : Deuxième Partie", type: "movie", importance: "essential", year: 2024, duration: 166, platform: "Prime Video", order: 4 },
      { id: "sf-5", title: "Fondation", type: "tv", importance: "recommended", year: 2021, duration: 55, platform: "Apple TV+", order: 5, episode_label: "Saison 1 à 3" },
      { id: "sf-6", title: "Interstellar", type: "movie", importance: "recommended", year: 2014, duration: 169, platform: "Netflix", order: 6 },
      { id: "sf-7", title: "Arrival", type: "movie", importance: "recommended", year: 2016, duration: 116, platform: "Prime Video", order: 7 },
      { id: "sf-8", title: "Dune : La Genèse d'un Univers", type: "special", importance: "optional", year: 2021, duration: 45, platform: "Prime Video", order: 8 },
      { id: "sf-9", title: "Black Mirror", type: "tv", importance: "optional", year: 2011, duration: 60, platform: "Netflix", order: 9 },
      { id: "sf-10", title: "Ad Astra", type: "movie", importance: "optional", year: 2019, duration: 123, platform: null, order: 10 },
    ],
  },
  {
    id: "wl-ghibli",
    slug: "animation-studio-ghibli",
    name: "Animation Studio Ghibli",
    description:
      "L'essentiel de la filmographie du Studio Ghibli, entre contes initiatiques et fresques oniriques.",
    color: "#fb7185",
    cover_url: "https://picsum.photos/seed/wv-ghibli/900/500",
    items: [
      { id: "gh-1", title: "Le Voyage de Chihiro", type: "movie", importance: "essential", year: 2001, duration: 125, platform: "Netflix", order: 1 },
      { id: "gh-2", title: "Princesse Mononoké", type: "movie", importance: "essential", year: 1997, duration: 134, platform: "Netflix", order: 2 },
      { id: "gh-3", title: "Mon voisin Totoro", type: "movie", importance: "essential", year: 1988, duration: 86, platform: "Netflix", order: 3 },
      { id: "gh-4", title: "Le Garçon et le Héron", type: "movie", importance: "essential", year: 2023, duration: 124, platform: "Cinéma", order: 4 },
      { id: "gh-5", title: "Le Château ambulant", type: "movie", importance: "recommended", year: 2004, duration: 119, platform: "Netflix", order: 5 },
      { id: "gh-6", title: "Le Vent se lève", type: "movie", importance: "recommended", year: 2013, duration: 126, platform: "Netflix", order: 6 },
      { id: "gh-7", title: "Les Origines du Studio Ghibli", type: "special", importance: "recommended", year: 2013, duration: 90, platform: "Arte", order: 7 },
      { id: "gh-8", title: "Ponyo sur la falaise", type: "movie", importance: "optional", year: 2008, duration: 101, platform: "Netflix", order: 8 },
      { id: "gh-9", title: "Souvenirs de Marnie", type: "movie", importance: "optional", year: 2014, duration: 103, platform: "Netflix", order: 9 },
    ],
  },
  {
    id: "wl-thrillers-psy",
    slug: "thrillers-psychologiques",
    name: "Thrillers psychologiques",
    description:
      "Des enquêtes glaçantes et des esprits troublés : le meilleur du thriller psychologique.",
    color: "#ef4444",
    cover_url: "https://picsum.photos/seed/wv-thrillers/900/500",
    items: [
      { id: "tp-1", title: "Se7en", type: "movie", importance: "essential", year: 1995, duration: 127, platform: "Netflix", order: 1 },
      { id: "tp-2", title: "Shutter Island", type: "movie", importance: "essential", year: 2010, duration: 138, platform: "Prime Video", order: 2 },
      { id: "tp-3", title: "Gone Girl", type: "movie", importance: "essential", year: 2014, duration: 149, platform: "Prime Video", order: 3 },
      { id: "tp-4", title: "Zodiac", type: "movie", importance: "recommended", year: 2007, duration: 157, platform: "Netflix", order: 4 },
      { id: "tp-5", title: "Mindhunter", type: "tv", importance: "recommended", year: 2017, duration: 50, platform: "Netflix", order: 5 },
      { id: "tp-6", title: "Prisoners", type: "movie", importance: "recommended", year: 2013, duration: 153, platform: null, order: 6 },
      { id: "tp-7", title: "Zodiac : Dans les coulisses de l'enquête", type: "special", importance: "optional", year: 2007, duration: 42, platform: "Netflix", order: 7 },
      { id: "tp-8", title: "Le Silence des agneaux", type: "movie", importance: "optional", year: 1991, duration: 118, platform: null, order: 8 },
      { id: "tp-9", title: "Black Swan", type: "movie", importance: "optional", year: 2010, duration: 108, platform: "Netflix", order: 9 },
    ],
  },
];

export async function getWatchlists(): Promise<Watchlist[]> {
  if (USE_MOCK) {
    return MOCK_WATCHLISTS;
  }

  const res = await fetch(`${API_BASE}/api/watchlists`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch watchlists: ${res.status}`);
  }
  return res.json();
}

export async function getWatchlist(slug: string): Promise<Watchlist | null> {
  if (USE_MOCK) {
    return MOCK_WATCHLISTS.find((wl) => wl.slug === slug) ?? null;
  }

  const res = await fetch(`${API_BASE}/api/watchlists/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch watchlist "${slug}": ${res.status}`);
  }
  return res.json();
}

export function getTotalMinutes(items: Pick<WatchItem, "duration">[]): number {
  return items.reduce((sum, item) => sum + (item.duration ?? 0), 0);
}

export function formatHoursLabel(totalMinutes: number): string {
  return `${Math.round(totalMinutes / 60)}h`;
}

export function formatItemDuration(minutes?: number | null): string | null {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}
