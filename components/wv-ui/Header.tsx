import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary text-foreground flex items-center justify-center gap-4 py-4">
      <nav className="flex flex-col w-4xl items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="bg-secondary rounded-full">
          <Link href="/">
            <Image
              src="/logo-wv2.png"
              alt="WatchVerse Logo"
              width={60}
              height={30}
            />
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href="/movies"
            className="text-sm sm:text-left flex items-center"
          >
            Films
          </Link>
          <Link
            href="/series"
            className="text-sm sm:text-left flex items-center"
          >
            Séries
          </Link>
          <Link
            href="/journals"
            className="text-sm sm:text-left flex items-center"
          >
            Journal de visionnage
          </Link>
          <Link
            href="/search"
            className="text-sm sm:text-left flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
