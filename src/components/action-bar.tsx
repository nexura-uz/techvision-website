import { PhoneIcon, SendIcon } from "lucide-react";
import { telHref } from "@/lib/site";
import type { SiteSettings, SocialLink } from "@/lib/types";

/** Most visitors arrive on a phone from Instagram: one tap to reach the shop from any page. */
export function ActionBar({ settings, socials }: { settings: SiteSettings; socials: SocialLink[] }) {
    const telegram = socials.find((link) => link.platform === "telegram");
    if (!settings.phone && !telegram) return null;
    return (
        <>
            <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
            <nav aria-label="Bog'lanish" className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
                {settings.phone && (
                    <a href={telHref(settings.phone)} className="btn btn-secondary flex-1 !w-auto">
                        <PhoneIcon size={18} aria-hidden /> Qo'ng'iroq
                    </a>
                )}
                {telegram && (
                    <a href={telegram.url} target="_blank" rel="noreferrer" className="btn btn-primary flex-1 !w-auto">
                        <SendIcon size={18} aria-hidden /> Telegram
                    </a>
                )}
            </nav>
        </>
    );
}
