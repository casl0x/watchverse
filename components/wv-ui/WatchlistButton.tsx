"use client";
import { useEffect, useState } from "react";

type Status = "a_voir" | "en_cours" | "termine" | null;

interface Props {
  mediaId: number;
  mediaType: string;
  title: string;
  posterPath: string;
}

export default function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
}: Props) {
  const [status, setStatus] = useState<Status>(null);
  const [seen, setSeen] = useState(false);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/entries/${mediaId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setStatus(data.status);
          setSeen(data.seen);
          setComment(data.comment ?? "");
        }
      });
  }, [mediaId]);

  async function save(newStatus: Status) {
    setStatus(newStatus);
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaId,
        mediaType,
        title,
        posterPath,
        status: newStatus,
        seen,
        comment,
      }),
    });
  }

  async function saveComment() {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaId,
        mediaType,
        title,
        posterPath,
        status,
        seen,
        comment,
      }),
    });
    setOpen(false);
  }

  const statusLabel: Record<string, string> = {
    a_voir: "🔖 À voir",
    en_cours: "▶️ En cours",
    termine: "✅ Terminé",
  };

  return (
    <div className="space-y-2">
      {/* Boutons statut */}
      <div className="flex gap-2 flex-wrap">
        {(["a_voir", "en_cours", "termine"] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => save(s)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              status === s
                ? "bg-purple-600 text-white"
                : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
            }`}
          >
            {statusLabel[s!]}
          </button>
        ))}

        {/* Vu / Pas vu */}
        <button
          onClick={() => {
            setSeen(!seen);
            fetch("/api/entries", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mediaId,
                mediaType,
                title,
                posterPath,
                status,
                seen: !seen,
                comment,
              }),
            });
          }}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
            seen
              ? "bg-green-600 text-white"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          {seen ? "👁️ Vu" : "👁️ Pas vu"}
        </button>

        {/* Commentaire */}
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1 rounded-full text-sm font-semibold bg-zinc-700 text-gray-300 hover:bg-zinc-600"
        >
          💬 Commenter
        </button>
      </div>

      {/* Zone commentaire */}
      {open && (
        <div className="flex gap-2 mt-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ton avis..."
            className="flex-1 bg-zinc-800 text-white rounded-lg p-2 text-sm resize-none"
            rows={3}
          />
          <button
            onClick={saveComment}
            className="bg-purple-600 text-white px-4 rounded-lg text-sm"
          >
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}
