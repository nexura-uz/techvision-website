"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Banner } from "@/lib/api";
import { mediaUrl } from "@/lib/api";

/** Homepage banners: swiped by hand (no autoplay), arrows on wider screens. Images are 1600 × 600 (8:3). */
export function BannerSlider({ banners, className = "" }: { banners: Banner[]; className?: string }) {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (direction: number) => row.current?.scrollBy({ left: direction * row.current.clientWidth, behavior: "smooth" });

  return (
    <section className={`relative ${className}`} aria-label="Bannerlar">
      <ul ref={row} className="flex snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none]">
        {banners.map((b, i) => {
          const image = <Image src={mediaUrl(b.image)} alt="" fill priority={i === 0} sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />;
          return (
            <li key={b.id} className="relative aspect-[8/3] w-full flex-none snap-start bg-paper">
              {b.link ? <Link href={b.link} aria-label={`Banner ${i + 1}`} className="absolute inset-0">{image}</Link> : image}
            </li>
          );
        })}
      </ul>
      {banners.length > 1 && (
        <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Oldingi banner" className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => scroll(1)} aria-label="Keyingi banner" className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"><ChevronRight className="size-5" /></button>
        </div>
      )}
    </section>
  );
}
