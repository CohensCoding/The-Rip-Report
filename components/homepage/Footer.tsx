import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800 py-10">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-1">
          <div className="font-serif text-lg text-paper">Rip Report</div>
          <div className="text-sm text-zinc-500">
            Sports card release breakdowns, without the noise.
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <Link className="transition hover:text-paper/80" href="/about">
            About
          </Link>
          <Link className="transition hover:text-paper/80" href="/contact">
            Contact
          </Link>
          <Link className="transition hover:text-paper/80" href="/rss">
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}

