import type { Metadata } from "next";
import { getWatchlists } from "@/lib/api";
import WatchlistsGrid from "@/components/WatchlistsGrid";

export const metadata: Metadata = {
  title: "Watchlists — WatchVerse",
  description: "Parcourez les watchlists organisées par WatchVerse.",
};

export default async function WatchlistsPage() {
  const watchlists = await getWatchlists();

  return <WatchlistsGrid watchlists={watchlists} />;
}
