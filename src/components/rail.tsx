"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useRef } from "react";

/** A row that scrolls sideways: swipe on phones, arrows on pointer screens. Children are the <li>s. */
export function Rail({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (direction: number) => row.current?.scrollBy({ left: direction * row.current.clientWidth * 0.9, behavior: "smooth" });
  const arrow = "pointer-events-auto hidden size-11 items-center justify-center rounded-full bg-white shadow-[var(--shadow-lift)] ring-1 ring-line hover:bg-stage md:flex";
  return (
    <div className="relative">
      <ul ref={row} aria-label={label} className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pt-1 pb-4 [scrollbar-width:none] md:gap-4">
        {children}
      </ul>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between md:-mx-5">
        <button type="button" onClick={() => scroll(-1)} aria-label="Oldingilar" className={arrow}><ChevronLeft className="size-5" /></button>
        <button type="button" onClick={() => scroll(1)} aria-label="Keyingilar" className={arrow}><ChevronRight className="size-5" /></button>
      </div>
    </div>
  );
}
