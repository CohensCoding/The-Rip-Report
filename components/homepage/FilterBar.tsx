"use client";

export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="h-10 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-paper/90 outline-none transition focus:border-zinc-600"
          defaultValue=""
          aria-label="Sport"
        >
          <option value="" disabled>
            Sport
          </option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="baseball">Baseball</option>
          <option value="hockey">Hockey</option>
          <option value="soccer">Soccer</option>
        </select>

        <select
          className="h-10 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-paper/90 outline-none transition focus:border-zinc-600"
          defaultValue=""
          aria-label="Brand"
        >
          <option value="" disabled>
            Brand
          </option>
          <option value="topps">Topps</option>
          <option value="topps-chrome">Topps Chrome</option>
          <option value="bowman">Bowman</option>
          <option value="panini-prizm">Prizm</option>
          <option value="upper-deck">Upper Deck</option>
        </select>

        <select
          className="h-10 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-paper/90 outline-none transition focus:border-zinc-600"
          defaultValue=""
          aria-label="Year"
        >
          <option value="" disabled>
            Year
          </option>
          <option value="2026">2026</option>
          <option value="2025-26">2025-26</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="w-full sm:w-[360px]">
        <input
          className="h-10 w-full rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-paper/90 outline-none transition placeholder:text-zinc-500 focus:border-zinc-600"
          placeholder="Search releases…"
        />
      </div>

      {/* TODO: wire up filtering in phase 2. */}
    </div>
  );
}

