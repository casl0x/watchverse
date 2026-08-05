import { img, tmdb } from "@/lib/tmdb";
import { MonitorPause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Show = {
  id: number;
  poster_path?: string | null;
  name: string;
  vote_average?: number | null;
};

export default async function SeriesPage() {
  const data: { results: Show[] } = await tmdb.popularShows();

  return (
    <main className="min-h-screen w-4xl mx-auto p-6">
      <h1 className="text-white text-3xl font-bold mb-6 flex items-center gap-2">
        <MonitorPause />
        Séries populaires
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.results.map((show: Show) => (
          <Link key={show.id} href={`/series/${show.id}`}>
            <div className="rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer">
              <div className="relative aspect-2/3">
                <Image
                  src={
                    show.poster_path
                      ? img(show.poster_path)
                      : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
                  }
                  alt={show.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-semibold line-clamp-2">
                    {show.name}
                  </p>
                  <p className="text-yellow-400 text-xs">
                    ⭐ {show.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
