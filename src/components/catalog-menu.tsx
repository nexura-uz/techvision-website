"use client";

import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/api";
import { CategoryIcon } from "./category-icon";

/** Desktop "Katalog": a full-width panel under the header. Top categories on the left (hover or focus picks one), its
 *  subcategories as tiles and its photo on the right. Esc, a click outside or following a link closes it. */
export function CatalogMenu({ categories, imageUrl }: { categories: Category[]; imageUrl: Record<number, string> }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const tops = categories.filter((c) => c.parent_id === null);
  const [activeId, setActiveId] = useState(tops[0]?.id);
  // the pointer has to rest on a category before it is picked, longer while it heads right (towards the tiles), so
  // crossing other rows on the way to the subcategories does not switch the panel; keyboard focus picks at once
  const pending = useRef<ReturnType<typeof setTimeout>>(undefined);
  const last = useRef({ x: 0, y: 0, right: false });
  const track = (e: React.MouseEvent) => {
    const dx = e.clientX - last.current.x, dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY, right: dx > Math.abs(dy) };
  };
  const pointAt = (id: number) => {
    clearTimeout(pending.current);
    pending.current = setTimeout(() => setActiveId(id), last.current.right ? 450 : 120);
  };
  const active = tops.find((t) => t.id === activeId) ?? tops[0];
  const subs = categories.filter((c) => c.parent_id === active?.id);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={box}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="btn h-11 bg-teal text-ink hover:bg-teal/85">
        <LayoutGrid className="size-4" aria-hidden /> Katalog <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && active && (
        <div onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
          className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-white text-ink shadow-[var(--shadow-lift)]">
          <div className="wrap grid grid-cols-[19rem_1fr] gap-8 py-6">
            <ul className="border-r border-line pr-4" onMouseMove={track}>
              {tops.map((t) => (
                <li key={t.id}>
                  <Link href={`/catalog/${t.slug}`} onMouseEnter={() => pointAt(t.id)} onMouseLeave={() => clearTimeout(pending.current)} onFocus={() => setActiveId(t.id)}
                    className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[0.95rem] font-medium ${t.id === active.id ? "bg-stage text-ink" : "text-ink/80 hover:bg-stage"}`}>
                    <CategoryIcon slug={t.slug} className={`size-5 ${t.id === active.id ? "text-teal-deep" : "text-muted"}`} />
                    {t.name}
                    <ChevronRight className="ml-auto size-4 text-muted" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid gap-8 xl:grid-cols-[1fr_17rem]" onMouseEnter={() => clearTimeout(pending.current)}>
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="display text-xl">{active.name}</p>
                  <Link href={`/catalog/${active.slug}`} className="text-sm font-semibold whitespace-nowrap text-teal-deep hover:underline">Hammasi: {active.products} ta →</Link>
                </div>
                {subs.length > 0 ? (
                  <ul className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-3">
                    {subs.map((s) => (
                      <li key={s.id}>
                        <Link href={`/catalog/${s.slug}`} className="flex h-full items-center gap-3 rounded-lg border border-line p-2 pr-4 hover:border-ink/30 hover:bg-stage">
                          <span className="relative size-12 flex-none overflow-hidden rounded-md bg-stage">
                            {imageUrl[s.id] && <Image src={imageUrl[s.id]} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />}
                          </span>
                          <span className="min-w-0 flex-1 leading-5 font-medium">{s.name}</span>
                          <span className="text-sm text-muted">{s.products}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-muted">Bu bo'limda {active.products} ta mahsulot bor.</p>
                )}
              </div>
              <Link href={`/catalog/${active.slug}`} className="relative hidden aspect-square items-center justify-center overflow-hidden rounded-xl bg-stage xl:flex" aria-label={active.name}>
                <CategoryIcon slug={active.slug} className="size-16 text-ink/15" />
                {imageUrl[active.id] && <Image key={active.id} src={imageUrl[active.id]} alt="" fill sizes="272px" className="object-contain p-6 mix-blend-multiply" />}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
