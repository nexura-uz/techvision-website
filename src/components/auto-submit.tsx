"use client";

import { useEffect, useRef } from "react";

/** Inside the catalog's filter form: on desktop, ticking a brand or "in stock" applies it at once (no button press);
 *  on phones the form sits in the filter sheet, where people tick several and press "Natijani ko'rsatish". Empty
 *  fields are left out of the address. */
export function AutoSubmit() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const form = mark.current?.closest("form");
    if (!form) return;
    const apply = (e: Event) => {
      if ((e.target as HTMLInputElement).type === "checkbox" && window.matchMedia("(min-width: 64rem)").matches) form.requestSubmit();
    };
    // empty price boxes stay out of the address (?brand=lenovo, not ?price_min=&price_max=&brand=lenovo)
    const tidy = (e: FormDataEvent) => {
      for (const [key, value] of [...e.formData.entries()]) if (value === "") e.formData.delete(key);
    };
    form.addEventListener("change", apply);
    form.addEventListener("formdata", tidy);
    return () => { form.removeEventListener("change", apply); form.removeEventListener("formdata", tidy); };
  }, []);
  return <span ref={mark} hidden />;
}
