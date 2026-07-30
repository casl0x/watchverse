import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-primary text-foreground flex items-center justify-center gap-4 py-4">
      <nav className="flex flex-col w-4xl items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="bg-secondary rounded-full">
          <Image
            src="/logo-wv2.png"
            alt="WatchVerse Logo"
            width={60}
            height={30}
          />
        </div>

        <div className="flex gap-4">
          <span className="text-sm sm:text-left flex items-center">Film</span>
          <span className="text-sm sm:text-left flex items-center">Série</span>
          <span className="text-sm sm:text-left flex items-center">
            Journal
          </span>
        </div>
      </nav>
    </header>
  );
}
