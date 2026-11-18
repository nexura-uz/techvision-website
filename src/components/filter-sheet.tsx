"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

/** The catalog filters: a sticky sidebar on desktop; on phones a "Filtr" button that opens them as a full-screen sheet. */
export function FilterSheet({ active, children }: { active: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-outline w-full lg:hidden">
        <SlidersHorizontal className="size-4" aria-hidden /> Filtr{active > 0 && <span className="badge bg-teal-deep text-white">{active}</span>}
      </button>
      <div role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label="Filtr"
        className={`${open ? "fixed inset-0 z-50 overflow-y-auto bg-white p-4 pb-24" : "hidden"} lg:sticky lg:top-24 lg:block lg:p-0`}>
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="display text-lg">Filtr</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Yopish" className="flex size-11 items-center justify-center rounded-lg hover:bg-stage"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </>
  );
}
