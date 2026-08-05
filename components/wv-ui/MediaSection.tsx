import { img } from "@/lib/tmdb";
import Link from "next/link";

interface Item {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
}

interface Props {
  title: string;
  items: Item[];
  type: "movies" | "series";
}

export default function MediaSection({ title, items, type }: Props) {
  return (
    <section className="px-6 py-4">
      <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {items.map((item, index) => {
          return (
            <Link key={item.id} href={`/${type}/${item.id}`}>
              <div
                className={`
                  relative shrink-0 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 w-32 h-48
                `}
              >
                {/* Poster */}
                <img
                  src={img(item.poster_path)}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                {/* Infos */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {item.title || item.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-yellow-400 text-xs font-bold">
                      {item.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
