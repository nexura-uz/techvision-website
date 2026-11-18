"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Category } from "@/lib/api";
import { som } from "@/lib/format";
import { CategoryIcon } from "./category-icon";

type Hit = { id: number; name: string; slug: string; brand: string | null; image: string | null; price_som: number | null };

/** The header search. A plain GET form to /catalog?q= (works before scripts load); with scripts, results show as you
 *  type: matching categories, then up to 6 products with photo and price, then "all results". Arrows move, Enter opens. */
export function SearchBox({ categories, className = "" }: { categories: Category[]; className?: string }) {
  const router = useRouter();
  const listId = useId();
  const box = useRef<HTMLFormElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [found, setFound] = useState<{ total: number; items: Hit[] } | null>(null);
  const [active, setActive] = useState(-1);

  const term = q.trim().toLowerCase();
  const cats = term.length < 2 ? [] : categories.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 4);
  const links = [...cats.map((c) => `/catalog/${c.slug}`), ...(found?.items ?? []).map((p) => `/product/${p.slug}`)];

  useEffect(() => {
    if (term.length < 2) return;
    const stop = new AbortController();
    const wait = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: stop.signal })
        .then((r) => r.json())
        .then((data) => { setFound(data); setActive(-1); })
        .catch(() => {}); // a newer search or a closed menu cancelled this one
    }, 200);
    return () => { clearTimeout(wait); stop.abort(); };
  }, [term]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  const showing = open && term.length >= 2 && found !== null;

  return (
    <form ref={box} action="/catalog" role="search" className={`relative flex ${className}`}
      onSubmit={(e) => {
        if (active >= 0 && links[active]) {
          e.preventDefault();
          go(links[active]);
        } else setOpen(false);
      }}>
      <input name="q" type="search" required enterKeyHint="search" autoComplete="off" value={q} placeholder="Noutbuk, monitor, printer..."
        role="combobox" aria-label="Mahsulot qidirish" aria-expanded={showing} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (!showing || !links.length) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % links.length); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? links.length - 1 : a - 1)); }
        }}
        className="field h-11 rounded-r-none border-white text-ink" />
      <button className="btn h-11 rounded-l-none bg-teal px-4 text-ink hover:bg-teal/85" aria-label="Qidirish"><Search className="size-5" aria-hidden /></button>

      {showing && (
        <div id={listId} role="listbox" className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl bg-white text-ink shadow-[var(--shadow-lift)] ring-1 ring-line">
          {cats.length > 0 && (
            <div className="border-b border-line p-2">
              {cats.map((c, i) => (
                <Link key={c.id} id={`${listId}-${i}`} role="option" aria-selected={active === i} href={`/catalog/${c.slug}`} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active === i ? "bg-stage" : "hover:bg-stage"}`}>
                  <CategoryIcon slug={c.slug} className="size-4 text-teal-deep" /> <span className="font-semibold">{c.name}</span>
                  <span className="ml-auto text-muted">{c.products} ta</span>
                </Link>
              ))}
            </div>
          )}
          {found.items.length > 0 ? (
            <ul className="p-2">
              {found.items.map((p, j) => {
                const i = cats.length + j;
                return (
                  <li key={p.id}>
                    <Link id={`${listId}-${i}`} role="option" aria-selected={active === i} href={`/product/${p.slug}`} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg p-2 ${active === i ? "bg-stage" : "hover:bg-stage"}`}>
                      <span className="relative size-12 flex-none overflow-hidden rounded-md bg-stage">
                        {p.image && <Image src={p.image} alt="" fill sizes="48px" className="object-contain p-1 mix-blend-multiply" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        {p.brand && <span className="block text-xs font-semibold text-muted uppercase">{p.brand}</span>}
                        <span className="line-clamp-1 text-sm font-medium">{p.name}</span>
                      </span>
                      {p.price_som !== null && <span className="text-sm font-bold whitespace-nowrap">{som(p.price_som)}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            cats.length === 0 && <p className="p-4 text-sm text-muted">«{q.trim()}» bo'yicha hech narsa topilmadi.</p>
          )}
          {found.total > found.items.length && (
            <button type="submit" className="block w-full border-t border-line bg-stage px-4 py-3 text-left text-sm font-semibold text-teal-deep hover:underline">
              Barcha natijalar: {found.total} ta →
            </button>
          )}
        </div>
      )}
    </form>
  );
}
