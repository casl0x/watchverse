const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = process.env.NEXT_REACT_APP_ACCESS_TOKEN;

async function tmdbFetch(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("language", "fr-FR");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const tmdb = {
  // 🎬 Films
  popularMovies: (page = "1") => tmdbFetch("/movie/popular", { page }),
  movie: (id: number) => tmdbFetch(`/movie/${id}`),
  movieCredits: (id: number) => tmdbFetch(`/movie/${id}/credits`),
  movieVideos: (id: number) => tmdbFetch(`/movie/${id}/videos`),
  similarMovies: (id: number) => tmdbFetch(`/movie/${id}/similar`),

  // 📺 Séries
  popularShows: (page = "1") => tmdbFetch("/tv/popular", { page }),
  show: (id: number) => tmdbFetch(`/tv/${id}`),
  showCredits: (id: number) => tmdbFetch(`/tv/${id}/credits`),
  showVideos: (id: number) => tmdbFetch(`/tv/${id}/videos`),
  showSeason: (id: number, season: number) =>
    tmdbFetch(`/tv/${id}/season/${season}`),
  similarShows: (id: number) => tmdbFetch(`/tv/${id}/similar`),

  // 🔥 Tendances
  trendingMovies: () => tmdbFetch("/trending/movie/week"),
  trendingShows: () => tmdbFetch("/trending/tv/week"),

  // 🔍 Recherche
  searchAll: (query: string) => tmdbFetch("/search/multi", { query }),
  searchMovies: (query: string) => tmdbFetch("/search/movie", { query }),
  searchShows: (query: string) => tmdbFetch("/search/tv", { query }),
};

// Helper image
export const img = (path: string, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";
