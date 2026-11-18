import { Phone, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/api";
import { formatPhone, telHref } from "@/lib/format";

// lucide has no brand icons: two simple outlines of our own
const Instagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
const YouTube = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></svg>
);

const SOCIALS = [
  { key: "instagram_url", label: "Instagram", icon: <Instagram /> },
  { key: "telegram_channel_url", label: "Telegram kanal", icon: <Send className="size-5" aria-hidden /> },
  { key: "youtube_url", label: "YouTube", icon: <YouTube /> },
] as const;

const LEGAL = ["offer", "privacy"]; // small, in the bottom line

/** Kept short on purpose (owner, 2026-11-18): logo, the few links people look for, the phone and the socials; the
 *  legal pages small at the bottom. Categories are in the header, shop details on /contact. */
export function Footer({ settings, pages }: { settings: Settings; pages: { slug: string; title: string }[] }) {
  const links = [
    { href: "/catalog", label: "Katalog" },
    { href: "/service", label: "Servis" },
    ...pages.filter((p) => p.slug === "delivery" || p.slug === "warranty").map((p) => ({ href: `/pages/${p.slug}`, label: p.title })),
    { href: "/contact", label: "Aloqa" },
  ];
  const legal = pages.filter((p) => LEGAL.includes(p.slug));
  return (
    <footer className="band-dark mt-16 lg:mt-24 [&_:focus-visible]:outline-teal">
      <div className="wrap flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="inline-flex w-fit items-center gap-2.5">
          <Image src="/logo.png" alt="" width={32} height={32} unoptimized />
          <span className="display text-lg tracking-wide">TECHVISION</span>
        </Link>
        <nav aria-label="Asosiy sahifalar">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            {links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          {settings.phone && (
            <a href={telHref(settings.phone)} className="mr-2 flex items-center gap-2 font-semibold hover:text-teal">
              <Phone className="size-4 text-teal" aria-hidden /> {formatPhone(settings.phone)}
            </a>
          )}
          {SOCIALS.filter((s) => settings[s.key]).map((s) => (
            <a key={s.key} href={settings[s.key]} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}
              className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-teal hover:text-ink">{s.icon}</a>
          ))}
        </div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} TECHVISION</p>
        {legal.length > 0 && (
          <ul className="flex gap-x-5">
            {legal.map((p) => <li key={p.slug}><Link href={`/pages/${p.slug}`} className="hover:text-white">{p.title}</Link></li>)}
          </ul>
        )}
      </div>
    </footer>
  );
}
