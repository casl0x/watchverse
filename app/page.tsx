import MediaSection from "@/components/wv-ui/MediaSection";
import { tmdb } from "@/lib/tmdb";

export default async function Home() {
  const [movies, shows] = await Promise.all([
    tmdb.trendingMovies(),
    tmdb.trendingShows(),
  ]);

  return (
    <main className="min-h-screen bg-[#1a1025] space-y-6 py-6">
      <MediaSection
        title="Films tendance"
        items={movies.results}
        type="movies"
      />
      <MediaSection
        title="Séries tendance"
        items={shows.results}
        type="series"
      />
    </main>
  );
}
