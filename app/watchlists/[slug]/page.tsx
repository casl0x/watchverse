import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWatchlist, getWatchlists } from "@/lib/api";
import WatchlistPage from "@/components/WatchlistPage";

export async function generateStaticParams() {
  const watchlists = await getWatchlists();
  return watchlists.map((wl) => ({ slug: wl.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const watchlist = await getWatchlist(slug);

  if (!watchlist) {
    return { title: "Watchlist introuvable — WatchVerse" };
  }

  return {
    title: `${watchlist.name} — WatchVerse`,
    description: watchlist.description ?? undefined,
    openGraph: {
      title: watchlist.name,
      description: watchlist.description ?? undefined,
      images: watchlist.cover_url ? [watchlist.cover_url] : undefined,
    },
  };
}

export default async function WatchlistSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const watchlist = await getWatchlist(slug);

  if (!watchlist) {
    notFound();
  }

  return <WatchlistPage watchlist={watchlist} />;
}
