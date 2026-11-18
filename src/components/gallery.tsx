"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Product photos. Desktop: thumbnails down the left, the big photo on the right. Phones: a row to swipe, with dots.
 *  Clicking (tapping) the photo opens it full screen: arrows, ← / → keys, Esc or × to close. `urls` are full URLs. */
export function Gallery({ urls, name }: { urls: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const strip = useRef<HTMLDivElement>(null);

  const show = (i: number) => {
    const next = (i + urls.length) % urls.length;
    setCurrent(next);
    const row = strip.current;
    if (row) row.scrollTo({ left: next * row.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!zoom) return;
    document.body.style.overflow = "hidden";
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % urls.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + urls.length) % urls.length);
    };
    window.addEventListener("keydown", keys);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", keys); };
  }, [zoom, urls.length]);

  if (urls.length === 0) return <div className="aspect-square rounded-2xl border border-line bg-white" />;
  const many = urls.length > 1;
  const arrow = "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-line hover:bg-white";

  return (
    <div className="lg:grid lg:grid-cols-[5rem_1fr] lg:gap-4">
      {many && (
        // at most 6 thumbnails, so none is cut off; with more photos the 6th shows "+N" and opens the full-screen view
        <div className="hidden flex-col gap-2 lg:flex">
          {urls.slice(0, 6).map((url, i) => {
            const rest = i === 5 && urls.length > 6 ? urls.length - 5 : 0;
            return (
              <button key={url} type="button" onMouseEnter={() => !rest && show(i)} onClick={() => (rest ? (setCurrent(i), setZoom(true)) : show(i))}
                aria-label={rest ? `Yana ${rest} ta rasm` : `${i + 1}-rasm`} aria-current={i === current}
                className={`relative aspect-square w-full flex-none overflow-hidden rounded-lg border bg-white ${i === current && !rest ? "border-ink" : "border-line hover:border-ink/40"}`}>
                <Image src={url} alt="" fill sizes="80px" className="object-contain p-1.5" />
                {rest > 0 && <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-white">+{rest}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="group relative">
        <div ref={strip} onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-line bg-white [scrollbar-width:none] lg:overflow-hidden">
          {urls.map((url, i) => (
            <button key={url} type="button" onClick={() => { setCurrent(i); setZoom(true); }} aria-label="Rasmni kattalashtirish"
              className="relative aspect-square w-full flex-none cursor-zoom-in snap-start">
              <Image src={url} alt={i === 0 ? name : ""} fill priority={i === 0} loading={i === 0 ? undefined : "lazy"} sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain p-6 lg:p-10" />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute top-3 right-3 hidden size-9 items-center justify-center rounded-full bg-white/90 text-muted shadow-sm ring-1 ring-line lg:flex"><Expand className="size-4" aria-hidden /></span>
        {many && (
          <>
            <button type="button" onClick={() => show(current - 1)} aria-label="Oldingi rasm" className={`${arrow} left-3 hidden opacity-0 transition-opacity group-hover:opacity-100 lg:flex`}><ChevronLeft className="size-5" /></button>
            <button type="button" onClick={() => show(current + 1)} aria-label="Keyingi rasm" className={`${arrow} right-3 hidden opacity-0 transition-opacity group-hover:opacity-100 lg:flex`}><ChevronRight className="size-5" /></button>
            <div className="mt-3 flex justify-center gap-1.5 lg:hidden" aria-hidden>
              {urls.map((url, i) => <span key={url} className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-ink" : "w-1.5 bg-ink/20"}`} />)}
            </div>
          </>
        )}
      </div>

      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={name} className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex items-center justify-between gap-4 p-3 lg:p-5">
            <p className="min-w-0 truncate text-sm font-medium">{name} <span className="text-muted">· {current + 1} / {urls.length}</span></p>
            <button type="button" onClick={() => setZoom(false)} aria-label="Yopish" autoFocus className="flex size-11 flex-none items-center justify-center rounded-full hover:bg-stage"><X className="size-6" /></button>
          </div>
          <div className="relative flex-1">
            <Image src={urls[current]} alt={name} fill sizes="100vw" className="object-contain p-4 lg:p-10" />
            {many && (
              <>
                <button type="button" onClick={() => setCurrent((c) => (c - 1 + urls.length) % urls.length)} aria-label="Oldingi rasm" className={`${arrow} left-3 lg:left-8`}><ChevronLeft className="size-6" /></button>
                <button type="button" onClick={() => setCurrent((c) => (c + 1) % urls.length)} aria-label="Keyingi rasm" className={`${arrow} right-3 lg:right-8`}><ChevronRight className="size-6" /></button>
              </>
            )}
          </div>
          {many && (
            <div className="flex justify-center gap-2 overflow-x-auto p-3 lg:p-5">
              {urls.map((url, i) => (
                <button key={url} type="button" onClick={() => setCurrent(i)} aria-label={`${i + 1}-rasm`}
                  className={`relative size-14 flex-none overflow-hidden rounded-lg border bg-white ${i === current ? "border-ink" : "border-line"}`}>
                  <Image src={url} alt="" fill sizes="56px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
