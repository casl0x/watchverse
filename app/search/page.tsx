// app/search/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/tmdb";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type SearchResult = {
  id: number;
  media_type: string;
  poster_path: string | null;
  title?: string;
  name?: string;
};

type SearchResponse = {
  results: SearchResult[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`/api/search?q=${query}`);
    const data: SearchResponse = await res.json();
    setResults(data.results.filter((r) => r.media_type !== "person"));
  }

  return (
    <main className="p-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film ou une série..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <Button variant="default" type="submit">
          Rechercher
        </Button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((item) => (
          <Link
            key={item.id}
            href={`/${item.media_type === "movie" ? "movies" : "series"}/${item.id}`}
          >
            <div className="rounded-lg overflow-hidden shadow hover:scale-105 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.poster_path ? img(item.poster_path) : ""}
                alt={item.title || item.name || "Poster"}
                className="w-full"
              />
              <div className="p-2">
                <p className="font-semibold text-sm truncate">
                  {item.title || item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.media_type === "movie" ? "Film" : "Série"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
