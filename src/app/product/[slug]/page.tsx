import { ChevronDown, Phone, Send, ShieldCheck, Truck, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Gallery } from "@/components/gallery";
import { QuickOrder } from "@/components/quick-order";
import { ReviewsSample } from "@/components/reviews-sample";
import { ProductRail, STOCK } from "@/components/product-card";
import { Section } from "@/components/section";
import { getProduct, getSettings, mediaUrl } from "@/lib/api";
import { formatPhone, som, telHref } from "@/lib/format";
import { jsonLd, productLd } from "@/lib/jsonld";

type Props = { params: Promise<{ slug: string }> };

const describe = (p: { short_description: string; name: string; specs: { value: string }[] }) =>
  (p.short_description || p.specs.slice(0, 4).map((s) => s.value).join(", ") || p.name).slice(0, 160);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return {
    title: p.name,
    description: describe(p),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.name, description: describe(p), images: p.images.slice(0, 1).map(mediaUrl) },
  };
}

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1];
}

export default async function ProductPage({ params }: Props) {
  const [p, settings] = await Promise.all([getProduct((await params).slug), getSettings()]);
  const stock = STOCK[p.stock_status];
  const discount = p.price_som && p.old_price_som ? Math.round((1 - p.price_som / p.old_price_som) * 100) : 0;
  const video = youtubeId(p.video_url);
  const crumbs = [
    { href: "/", label: "Bosh sahifa" }, { href: "/catalog", label: "Katalog" },
    ...[p.parent_category, p.category].filter((c) => c !== null).map((c) => ({ href: `/catalog/${c.slug}`, label: c.name })),
  ];
  const key = p.specs.filter((s) => s.name !== "Xolati").slice(0, 6);
  const price = p.price_som ? som(p.price_som) : "Narxini so'rang";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productLd(p))} />
      <div className="wrap">
        <Breadcrumbs items={crumbs} />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <Gallery urls={p.images.map(mediaUrl)} name={p.name} />

          {/* stays in view next to the gallery on desktop */}
          <div className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
            <div>
              {p.brand && (
                <Link href={`/catalog?brand=${p.brand.slug}`} title={`${p.brand.name}: barcha mahsulotlar`}
                  className="mb-3 inline-flex h-16 items-center rounded-xl border border-line bg-white px-4 hover:border-ink/30">
                  {p.brand.logo
                    ? <Image src={mediaUrl(p.brand.logo)} alt={p.brand.name} width={200} height={56} className="h-12 w-auto max-w-48 object-contain" />
                    : <span className="font-semibold">{p.brand.name}</span>}
                </Link>
              )}
              <h1 className="font-sans text-2xl leading-tight font-bold tracking-tight lg:text-[2rem]">{p.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className={`flex items-center gap-1.5 font-medium ${stock.className}`}><span className={`size-2 rounded-full ${stock.dot}`} aria-hidden />{stock.label}</span>
                {p.mpn && <span className="text-muted">Model: <span className="font-medium text-ink">{p.mpn}</span></span>}
              </p>
            </div>

            <div className="rounded-2xl border border-line p-5 lg:p-6">
              {p.old_price_som && (
                <p className="flex items-center gap-2 text-sm text-muted">
                  <s>{som(p.old_price_som)}</s>
                  {discount > 0 && <span className="badge rounded-full bg-red-600 text-white">-{discount}%</span>}
                </p>
              )}
              <p className="text-3xl font-bold tracking-tight lg:text-4xl">{price}</p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <AddToCart id={p.id} name={p.name} stock={p.stock_status} priced={p.price_som !== null} large />
                {p.price_som !== null && p.stock_status !== "none" && <QuickOrder id={p.id} name={p.name} price={price} />}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                {settings.phone && <a href={telHref(settings.phone)} className="flex items-center gap-2 hover:underline"><Phone className="size-4" aria-hidden /> {formatPhone(settings.phone)}</a>}
                {settings.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline"><Send className="size-4" aria-hidden /> Telegramda so'rash</a>}
              </div>
              {/* only facts the shop states: the product's own warranty, delivery to the regions, its service centre */}
              <ul className={`mt-5 grid gap-2 border-t border-line pt-5 text-center text-xs leading-tight ${p.warranty ? "grid-cols-3" : "grid-cols-2"}`}>
                {p.warranty && <li className="rounded-xl bg-stage p-3"><ShieldCheck className="mx-auto mb-1.5 size-5" aria-hidden /><b className="block text-sm">{p.warranty}</b>kafolat</li>}
                <li className="rounded-xl bg-stage p-3"><Truck className="mx-auto mb-1.5 size-5" aria-hidden /><b className="block text-sm">Yetkazib berish</b>viloyatlarga</li>
                <li className="rounded-xl bg-stage p-3"><Wrench className="mx-auto mb-1.5 size-5" aria-hidden /><b className="block text-sm">Servis markazi</b>o'zimizda</li>
              </ul>
            </div>

            {key.length > 0 && (
              <div className="rounded-2xl border border-line p-5 lg:p-6">
                <p className="font-semibold">Asosiy xususiyatlar</p>
                <dl className="mt-3 grid text-sm">
                  {key.map((s) => (
                    <div key={s.name} className="flex justify-between gap-4 border-b border-dashed border-line py-2 last:border-b-0">
                      <dt className="flex-none text-muted">{s.name}</dt>
                      <dd className="min-w-0 truncate text-right font-medium" title={s.value}>{s.value}</dd>
                    </div>
                  ))}
                </dl>
                {p.specs.length > key.length && <a href="#specs" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">Barcha xususiyatlar <ChevronDown className="size-4" aria-hidden /></a>}
              </div>
            )}
          </div>
        </div>
      </div>

      {p.specs.length > 0 && (
        <Section title="Xususiyatlari" id="specs">
          <dl className="grid overflow-hidden rounded-2xl border border-line xl:grid-cols-2">
            {[...p.specs, ...(p.mpn ? [{ name: "Model kodi", value: p.mpn }] : [])].map((s) => (
              <div key={s.name} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-line px-5 py-3.5 text-sm last:border-b-0 lg:text-[0.95rem] xl:[&:nth-last-child(2):nth-child(odd)]:border-b-0 xl:odd:border-r">
                <dt className="text-muted">{s.name}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {p.description && (
        <Section title="Tavsif"><p className="max-w-3xl leading-7 whitespace-pre-wrap">{p.description}</p></Section>
      )}

      {video && (
        <Section title="Video">
          <iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={`${p.name}: video`} loading="lazy" allowFullScreen
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" className="aspect-video w-full max-w-4xl rounded-2xl border-0 bg-stage" />
        </Section>
      )}

      <ReviewsSample />

      {p.similar.length > 0 && (
        <Section title="O'xshash mahsulotlar" link={p.category ? { href: `/catalog/${p.category.slug}`, label: "Barchasi" } : undefined}>
          <ProductRail products={p.similar} label="O'xshash mahsulotlar" />
        </Section>
      )}

      {/* phones: the price and the cart button stay on screen (over the call / Telegram bar) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-xs text-muted">{p.name}</p>
          <p className="text-lg font-bold whitespace-nowrap">{price}</p>
        </div>
        <div className="w-40 flex-none empty:hidden"><AddToCart id={p.id} name={p.name} stock={p.stock_status} priced={p.price_som !== null} large /></div>
        {settings.phone && <a href={telHref(settings.phone)} aria-label="Qo'ng'iroq qilish" className="btn btn-outline size-11 flex-none p-0"><Phone className="size-5" aria-hidden /></a>}
      </div>
    </>
  );
}
