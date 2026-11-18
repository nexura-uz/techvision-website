"use client";

import Image from "next/image";
import { useState } from "react";

/** A card's photos (owner, 2026-11-18): one small block per photo along the bottom of the photo; pointing at a block
 *  shows that photo, leaving the card goes back to the first. The other photos load when the pointer first enters the
 *  photo. Touch screens (no hover) show the first photo without blocks. */
export function CardPhotos({ urls, alt, sizes }: { urls: string[]; alt: string; sizes: string }) {
  const [shown, setShown] = useState(0);
  const [warm, setWarm] = useState(false); // the pointer has been here: the other photos may load
  const many = urls.length > 1;
  return (
    <div className="absolute inset-0" onPointerEnter={(e) => e.pointerType === "mouse" && setWarm(true)} onPointerLeave={() => setShown(0)}>
      {urls.map((url, i) => (i === 0 || warm) && (
        <Image key={url} src={url} alt={i === 0 ? alt : ""} fill sizes={sizes}
          className={`object-contain p-5 pb-7 transition-opacity duration-150 lg:p-6 lg:pb-8 ${i === shown ? "opacity-100" : "opacity-0"}`} />
      ))}
      {many && (
        <div className="absolute inset-x-3 bottom-1.5 hidden gap-1 [@media(hover:hover)]:flex" aria-hidden>
          {urls.map((url, i) => (
            // a tall invisible hover area around each thin visible block
            <span key={url} onPointerEnter={() => { setWarm(true); setShown(i); }} className="flex h-5 flex-1 cursor-pointer items-end pb-0.5">
              <span className={`h-1 w-full rounded-full transition-colors ${i === shown ? "bg-ink" : "bg-ink/15"}`} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
