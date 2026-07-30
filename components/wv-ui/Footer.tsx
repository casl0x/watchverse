import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="bg-primary text-foreground flex items-center justify-center gap-4 py-6 ">
      <div className="flex flex-col w-4xl items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="text-xs text-left flex flex-col gap-1">
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
          <p className="flex gap-1 items-center">
            © 2026 WatchVerse. All rights reserved.
            <Button variant="link" className="p-0 text-sm text-foreground">
              <a
                href="https://github.com/casl0x"
                target="_blank"
                rel="noopener noreferrer"
              >
                About the developer
              </a>
            </Button>
          </p>
        </div>
      </div>
    </footer>
  );
}
