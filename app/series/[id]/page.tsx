import { img, tmdb } from "@/lib/tmdb";
import Image from "next/image";

type Video = { type?: string; site?: string; key?: string };
type Genre = { id: number; name: string };
type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};
type Season = {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path?: string | null;
};

export default async function ShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [show, credits, videos] = await Promise.all([
    tmdb.show(+id),
    tmdb.showCredits(+id),
    tmdb.showVideos(+id),
  ]);

  const trailer = videos.results.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <main>
      {/* Backdrop */}
      <div
        className="h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url(${img(show.backdrop_path, "original")})`,
        }}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Infos principales */}
        <div className="flex gap-6">
          <Image
            src={img(show.poster_path)}
            alt={show.name}
            width={200}
            height={240}
          />
          <div>
            <h1 className="text-3xl font-bold">{show.name}</h1>
            <p className="text-gray-500">
              {show.first_air_date?.slice(0, 4)} • {show.number_of_seasons}{" "}
              saison{show.number_of_seasons > 1 ? "s" : ""} •{" "}
              {show.number_of_episodes} épisodes
            </p>
            <p className="text-yellow-500 text-lg">
              ⭐ {show.vote_average?.toFixed(1)}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {show.genres.map((g: Genre) => (
                <span
                  key={g.id}
                  className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {show.overview}
            </p>
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <div>
            <h2 className="text-xl font-bold mb-2">Bande-annonce</h2>
            <iframe
              className="w-full aspect-video rounded-lg"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allowFullScreen
            />
          </div>
        )}

        {/* Saisons */}
        <div>
          <h2 className="text-xl font-bold mb-3">Saisons</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {show.seasons
              .filter((s: Season) => s.season_number > 0)
              .map((season: Season) => (
                <div key={season.id} className="min-w-30 shrink-0">
                  {season.poster_path ? (
                    <Image
                      src={img(season.poster_path)}
                      alt={season.name}
                      width={120}
                      height={180}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-2/3 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                  )}
                  <p className="text-sm font-semibold mt-1">{season.name}</p>
                  <p className="text-xs text-gray-500">
                    {season.episode_count} épisodes
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Casting */}
        <div>
          <h2 className="text-xl font-bold mb-2">Casting</h2>
          <div className="flex gap-3 overflow-x-auto">
            {credits.cast.slice(0, 10).map((actor: CastMember) => (
              <div key={actor.id} className="min-w-25 text-center">
                {actor.profile_path ? (
                  <Image
                    src={img(actor.profile_path, "w185")}
                    alt={actor.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto" />
                )}
                <p className="text-xs font-semibold mt-1">{actor.name}</p>
                <p className="text-xs text-gray-500">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
