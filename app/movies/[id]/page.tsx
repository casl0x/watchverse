import { img, tmdb } from "@/lib/tmdb";
import Image from "next/image";

type Video = {
  type?: string;
  site?: string;
  key?: string;
};

type Genre = {
  id: number;
  name: string;
};

type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, credits, videos] = await Promise.all([
    tmdb.movie(+id),
    tmdb.movieCredits(+id),
    tmdb.movieVideos(+id),
  ]);

  const trailer = videos.results.find(
    (v: Video) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <main>
      <div
        className="h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url(${img(movie.backdrop_path, "original")})`,
        }}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex gap-6">
          <img
            src={img(movie.poster_path)}
            className="w-40 rounded-lg shadow"
          />
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-gray-500">
              {movie.release_date?.slice(0, 4)} • {movie.runtime} min
            </p>
            <p className="text-yellow-500 text-lg">
              ⭐ {movie.vote_average?.toFixed(1)}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {movie.genres.map((g: Genre) => (
                <span
                  key={g.id}
                  className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              {movie.overview}
            </p>
          </div>
        </div>

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

        <div>
          <h2 className="text-xl font-bold mb-2">Casting</h2>
          <div className="flex gap-3 overflow-x-auto">
            {credits.cast.slice(0, 10).map((actor: CastMember) => (
              <div key={actor.id} className="min-w-[100px] text-center">
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
