"use client";

import { useRouter, useSearchParams } from "next/navigation";

/** Sorting that applies as soon as it is changed; keeps the other filters, goes back to page 1. */
export function SortSelect({ options, value }: { options: readonly (readonly [string, string])[]; value: string }) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted sm:inline">Saralash:</span>
      <select value={value} aria-label="Saralash" className="field h-10 min-h-10 w-auto py-1 pr-8 text-sm font-semibold"
        onChange={(e) => {
          const next = new URLSearchParams(params);
          next.set("sort", e.target.value);
          next.delete("page");
          window.dispatchEvent(new Event("techvision:navigate")); // the loading bar
          router.push(`?${next}`, { scroll: false });
        }}>
        {options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>
    </label>
  );
}
