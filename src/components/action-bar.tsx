import { Phone, Send } from "lucide-react";
import type { Settings } from "@/lib/api";
import { telHref } from "@/lib/format";

/** Phones only: calling or writing on Telegram is one tap away on every page (most visitors come from Instagram). */
export function ActionBar({ settings }: { settings: Settings }) {
  if (!settings.phone && !settings.telegram_url) return null;
  return (
    <>
      <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <nav aria-label="Bog'lanish" className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        {settings.phone && <a href={telHref(settings.phone)} className="btn btn-outline flex-1"><Phone className="size-4" aria-hidden /> Qo'ng'iroq</a>}
        {settings.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noreferrer" className="btn btn-primary flex-1"><Send className="size-4" aria-hidden /> Telegram</a>}
      </nav>
    </>
  );
}
