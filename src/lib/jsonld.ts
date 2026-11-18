import { type Product, type Settings, type Store, SITE_URL, mediaUrl } from "./api";

/** For <script type="application/ld+json">: "<" is escaped so text from the admin can never close the tag. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

const AVAILABILITY = { in_stock: "InStock", to_order: "InStock", on_the_way: "PreOrder", none: "OutOfStock" } as const;

/** What Google shows for a product: name, photos, brand and, when there is a price, the offer in so'm. */
export function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.slice(0, 5).map(mediaUrl),
    description: p.short_description || p.specs.slice(0, 4).map((s) => `${s.name}: ${s.value}`).join(", "),
    ...(p.mpn && { mpn: p.mpn }),
    ...(p.brand && { brand: { "@type": "Brand", name: p.brand.name } }),
    ...(p.price_som && {
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/product/${p.slug}`,
        price: p.price_som,
        priceCurrency: "UZS",
        availability: `https://schema.org/${AVAILABILITY[p.stock_status]}`,
      },
    }),
  };
}

/** The shop and each of its locations, for Google's map and search results. */
export function storesLd(stores: Store[], settings: Settings) {
  const sameAs = [settings.instagram_url, settings.telegram_url, settings.telegram_channel_url, settings.youtube_url].filter(Boolean);
  return stores.map((s) => ({
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: s.name,
    url: SITE_URL,
    telephone: s.phone,
    address: { "@type": "PostalAddress", streetAddress: s.address, ...(s.region && { addressRegion: s.region }), addressCountry: "UZ" },
    ...(s.latitude && s.longitude && { geo: { "@type": "GeoCoordinates", latitude: Number(s.latitude), longitude: Number(s.longitude) } }),
    ...(s.image && { image: mediaUrl(s.image) }),
    ...(sameAs.length && { sameAs }),
  }));
}
