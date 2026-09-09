import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary text-foreground flex items-center justify-center gap-4 py-4">
      <nav className="flex flex-col w-4xl items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="bg-secondary rounded-full">
          <Link href="/watchlists">
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
            href="/watchlists"
            className="text-sm sm:text-left flex items-center"
          >
            Watchlists
          </Link>
        </div>
      </nav>
    </header>
  );
}
