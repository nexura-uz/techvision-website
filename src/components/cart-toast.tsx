"use client";

import { CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const EVENT = "techvision:cart-added";

/** Inside an add-to-cart form: as soon as the form starts sending, tells the toast which product is being added. (Not
 *  when it finishes: by then the page has refreshed and this button has become "Savatda", so this part is gone. Adding
 *  only fails when the cart already holds 50 different products.) */
export function CartAdded({ name }: { name: string }) {
  const { pending } = useFormStatus();
  useEffect(() => {
    if (pending) window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
  }, [pending, name]);
  return null;
}

/** One per page (in the layout): "Savatga qo'shildi" with the product's name and a link to the cart, for 4 seconds.
 *  Announced to screen readers; sits above the phones' bottom bar. */
export function CartToast() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    const show = (e: Event) => {
      setName((e as CustomEvent<string>).detail);
      clearTimeout(hide);
      hide = setTimeout(() => setName(null), 4000);
    };
    window.addEventListener(EVENT, show);
    return () => { window.removeEventListener(EVENT, show); clearTimeout(hide); };
  }, []);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex justify-center lg:inset-x-auto lg:right-6 lg:bottom-6">
      {name && (
        <div role="status" className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink p-3 pl-4 text-white shadow-[var(--shadow-lift)] motion-safe:animate-[toast-in_200ms_ease-out]">
          <CircleCheck className="size-6 flex-none text-teal" aria-hidden />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold">Savatga qo'shildi</p>
            <p className="truncate text-white/60">{name}</p>
          </div>
          <Link href="/cart" onClick={() => setName(null)} className="btn min-h-9 flex-none bg-teal px-3 text-sm text-ink hover:bg-teal/85">Savatni ochish</Link>
          <button type="button" onClick={() => setName(null)} aria-label="Yopish" className="flex size-8 flex-none items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
        </div>
      )}
    </div>
  );
}
