import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { img } from "@/lib/tmdb";
import { Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type JournalEntry = Awaited<ReturnType<typeof prisma.entry.findMany>>[number];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function groupByMonth(entries: JournalEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      const key = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(new Date(entry.updatedAt));
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {} as Record<string, JournalEntry[]>,
  );
}

const statusConfig = {
  termine: { label: "Terminé", color: "#4caf50" },
  en_cours: { label: "En cours", color: "#ff9800" },
  a_voir: { label: "À voir", color: "#9e9e9e" },
};

export default async function JournalPage() {
  const entries = await prisma.entry.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const grouped = groupByMonth(entries);

  return (
    <main className="min-h-screen  p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <p className=" text-sm mt-1">
          {entries.length} entrée{entries.length > 1 ? "s" : ""}
        </p>

        {/* Filtres */}
        <div className=" px-4 py-3 flex gap-2 overflow-x-auto">
          {["Tout", "Terminé", "En cours", "À voir", "Films", "Séries"].map(
            (f) => (
              <Button key={f}>{f}</Button>
            ),
          )}
        </div>

        {/* Entrées groupées par mois */}
        <div className="overflow-hidden">
          {(Object.entries(grouped) as Array<[string, JournalEntry[]]>).map(
            ([month, items]) => (
              <div key={month}>
                <p className="px-4 pt-3 pb-1 text-xs uppercase tracking-widest font-medium">
                  {month}
                </p>
                {items.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/${entry.mediaType === "movie" ? "movies" : "series"}/${entry.mediaId}`}
                  >
                    <div className="flex gap-3 px-4 py-3 border-b border-yellow-100 hover:bg-yellow-50 transition">
                      {/* Poster */}
                      <Image
                        src={img(entry.posterPath ?? "", "w185")}
                        alt={entry.title}
                        width={40}
                        height={56}
                        unoptimized
                        className="w-10 h-14 rounded-lg object-cover shrink-0"
                      />

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-yellow-900 truncate">
                          {entry.title}
                        </p>
                        <p className="text-xs text-yellow-600 mt-0.5">
                          {entry.mediaType === "movie" ? "Film" : "Série"} ·{" "}
                          {formatDate(entry.updatedAt)}
                        </p>
                        {entry.comment && (
                          <p className="text-xs text-yellow-800 mt-1 italic bg-yellow-100 rounded px-2 py-1 line-clamp-2">
                            &quot;{entry.comment}&quot;
                          </p>
                        )}
                      </div>

                      {/* Statut */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background:
                              statusConfig[
                                entry.status as keyof typeof statusConfig
                              ]?.color ?? "#9e9e9e",
                          }}
                        />
                        <p className="text-[10px] text-yellow-600 writing-mode-vertical">
                          {
                            statusConfig[
                              entry.status as keyof typeof statusConfig
                            ]?.label
                          }
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ),
          )}

          {entries.length === 0 && (
            <div className="p-8 text-center items-center flex flex-col gap-2">
              <Book />
              <p className="font-medium">Ton journal est vide</p>
              <p className="text-sm mt-1">
                Commence par marquer un film ou une série
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
