"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** A thin teal bar across the top while the next page loads (links, filter and sort changes, page numbers). It starts
 *  on a click on an internal link or a form sent with GET, and ends when the address has changed. While it runs,
 *  <html data-loading> lets parts of the page show that they are being replaced (the catalog's grid fades). */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  // loading = we are still at the address where a navigation started; a new address ends it by itself
  const here = `${pathname}?${search}`;
  const [from, setFrom] = useState<string | null>(null);
  const loading = from === here;

  useEffect(() => {
    const start = () => setFrom(`${location.pathname}?${new URLSearchParams(location.search)}`);
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest("a");
      if (!link || link.target || link.hasAttribute("download")) return;
      const to = new URL(link.href, location.href);
      if (to.origin !== location.origin || (to.pathname === location.pathname && to.search === location.search)) return; // other sites, #anchors
      start();
    };
    const submit = (e: SubmitEvent) => {
      // only forms that go to another address (search, filters): those have a real action path. Server-action forms
      // (add to cart, checkout) have none, or a "javascript:" one, and no method once React drew them in the browser,
      // so their method can't be trusted: the bar then never stopped (owner saw it after "Savatga", 2026-11-18)
      const action = (e.target as HTMLFormElement).getAttribute("action") ?? "";
      if (action.startsWith("/")) start();
    };
    document.addEventListener("click", click);
    document.addEventListener("submit", submit);
    window.addEventListener("techvision:navigate", start); // code that changes the address itself (the sort menu)
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("submit", submit);
      window.removeEventListener("techvision:navigate", start);
    };
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-loading", loading);
    if (!loading) return;
    const giveUp = setTimeout(() => setFrom(null), 15000); // e.g. the navigation failed
    return () => clearTimeout(giveUp);
  }, [loading]);

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 overflow-hidden transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"}`}>
      <div className="h-full w-1/3 bg-teal motion-safe:animate-[nav-progress_1s_ease-in-out_infinite]" />
    </div>
  );
}
