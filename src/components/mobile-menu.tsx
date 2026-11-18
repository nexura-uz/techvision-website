"use client";

import { Menu, Phone, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category, Settings } from "@/lib/api";
import { formatPhone, telHref } from "@/lib/format";
import { NAV } from "@/lib/nav";
import { CategoryIcon } from "./category-icon";

/** Phones: a full-height sheet with the top categories as big tiles, the pages, and call / Telegram buttons. */
export function MobileMenu({ categories, settings }: { categories: Category[]; settings: Settings }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Menyuni yopish" : "Menyuni ochish"} className="flex size-11 items-center justify-center">
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
      </button>
      {open && (
        // any link inside closes the sheet as it is followed
        <div onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)} className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-white pb-10 text-ink">
          <div className="wrap pt-5">
            <p className="eyebrow mb-3">Katalog</p>
            <ul className="grid grid-cols-2 gap-2">
              {categories.filter((c) => c.parent_id === null).map((c) => (
                <li key={c.id}>
                  <Link href={`/catalog/${c.slug}`} className="flex h-full min-h-24 flex-col justify-between gap-2 rounded-xl bg-stage p-3">
                    <CategoryIcon slug={c.slug} className="size-6 text-teal-deep" />
                    <span className="leading-5 font-semibold">{c.name}<span className="block text-xs font-normal text-muted">{c.products} ta</span></span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6">
              {NAV.map((item) => (
                <li key={item.href}><Link href={item.href} className="flex min-h-12 items-center border-b border-line font-medium">{item.label}</Link></li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {settings.phone && <a href={telHref(settings.phone)} className="btn btn-outline"><Phone className="size-4" aria-hidden /> {formatPhone(settings.phone).replace("+998 ", "")}</a>}
              {settings.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noreferrer" className="btn btn-primary"><Send className="size-4" aria-hidden /> Telegram</a>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
