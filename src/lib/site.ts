import type { SiteSettings, SocialLink } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tech-vision.uz";

/** Prices are stored in USD and shown in so'm at the rate set in Django admin. */
export function formatPrice(usd: string | number, usdRate: string | undefined) {
    if (!usdRate) return `$${Number(usd).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    return `${Math.round(Number(usd) * Number(usdRate)).toLocaleString("ru-RU")} so'm`;
}

export function formatPhone(value: string) {
    const m = value.replace(/\D/g, "").match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
    return m ? `+998 (${m[1]}) ${m[2]}-${m[3]}-${m[4]}` : value;
}

export const mapHref = (contact: { latitude: string; longitude: string }) =>
    `https://yandex.uz/maps/?pt=${contact.longitude},${contact.latitude}&z=16&l=map`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const formatDate = (value: string) => new Date(value).toLocaleDateString("ru-RU", { timeZone: "Asia/Tashkent" });

/** Escapes "<" so API text can never close the surrounding script tag. */
export function jsonLd(data: unknown) {
    return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function storeJsonLd(settings: SiteSettings, socials: SocialLink[]) {
    return {
        "@context": "https://schema.org",
        "@type": "ComputerStore",
        name: "TECHVISION",
        url: SITE_URL,
        ...(settings.phone && { telephone: settings.phone }),
        address: { "@type": "PostalAddress", addressLocality: "Margilon", addressRegion: "Farg'ona", addressCountry: "UZ" },
        sameAs: socials.map((link) => link.url),
    };
}
