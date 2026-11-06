import Link from "next/link";
import { NAV } from "@/components/nav-links";
import { formatPhone, mapHref, telHref } from "@/lib/site";
import type { Contact, SiteSettings, SocialLink } from "@/lib/types";

const PLATFORM_NAMES: Record<string, string> = {
    instagram: "Instagram",
    telegram: "Telegram",
    youtube: "YouTube",
    tiktok: "TikTok",
    facebook: "Facebook",
};

export function Footer({ settings, socials, contacts }: { settings: SiteSettings; socials: SocialLink[]; contacts: Contact[] }) {
    return (
        <footer className="mt-16 border-t border-line lg:mt-24">
            <div className="wrap grid grid-cols-2 gap-x-6 gap-y-6 py-10 md:grid-cols-3">
                <div className="col-span-2 md:col-span-1">
                    {contacts.map((contact) => (
                        <a key={contact.id} href={mapHref(contact)} target="_blank" rel="noreferrer" className="flex min-h-11 items-center text-lg hover:underline">
                            {contact.region_details.name}, {contact.address}
                        </a>
                    ))}
                    {settings.phone && <a href={telHref(settings.phone)} className="flex min-h-11 items-center font-medium hover:underline">{formatPhone(settings.phone)}</a>}
                    {settings.working_hours && <p className="text-muted">{settings.working_hours}</p>}
                </div>
                <nav aria-label="Sahifalar" className="flex flex-col items-start">
                    {NAV.map((item) => (
                        <Link key={item.href} href={item.href} className="flex min-h-11 items-center hover:underline">{item.label}</Link>
                    ))}
                </nav>
                <div className="flex flex-col items-start">
                    {socials.map((link) => (
                        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center hover:underline">
                            {PLATFORM_NAMES[link.platform] ?? new URL(link.url).hostname}
                        </a>
                    ))}
                </div>
            </div>
            <p className="wrap pb-6 text-sm text-muted">© {new Date().getFullYear()} TECHVISION</p>
        </footer>
    );
}
