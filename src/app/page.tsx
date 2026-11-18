import { ArrowRight, Cctv, ChevronDown, ChevronRight, Send, ShieldCheck, Truck, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BannerSlider } from "@/components/banner-slider";
import { NewsCards } from "@/components/news-cards";
import { ProductRail } from "@/components/product-card";
import { ICONS, ServiceCards } from "@/components/service-cards";
import { Section } from "@/components/section";
import { type ServiceGroup, getBanners, getBrands, getCategories, getFaqs, getNews, getProducts, getServices, getSettings, getStores, mediaUrl } from "@/lib/api";
import { jsonLd, storesLd } from "@/lib/jsonld";

// only promises the shop already makes: the warranty from its Instagram bio, delivery from its old FAQ
const PROMISES = [
  { icon: ShieldCheck, title: "2 yilgacha kafolat", text: "Mahsulotga qarab" },
  { icon: Truck, title: "Yetkazib berish", text: "Barcha viloyatlarga" },
  { icon: Wrench, title: "Servis markazi", text: "Ta'mirlash va diagnostika" },
  { icon: Cctv, title: "Kamera o'rnatish", text: "Uy, do'kon va ofislar" },
];

/** The hero's right column: the service groups that carry the shop's margin, always in view. */
function HeroTile({ group }: { group: ServiceGroup }) {
  const Icon = ICONS[group.icon] ?? Wrench;
  return (
    <Link href={`/service/${group.slug}`} className="group band-dark relative flex min-h-36 flex-1 flex-col justify-end overflow-hidden rounded-xl p-5 lg:p-6">
      {group.image ? (
        <Image src={mediaUrl(group.image)} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover opacity-45 transition-transform duration-500 motion-safe:group-hover:scale-105" />
      ) : (
        <Icon className="absolute top-5 right-5 size-16 text-teal/25 lg:size-20" aria-hidden />
      )}
      <span className="relative">
        <span className="eyebrow">Servis</span>
        <span className="display mt-1.5 block text-lg lg:text-xl">{group.name}</span>
        <span className="mt-1 hidden text-sm text-white/65 sm:block">{group.summary}</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">Batafsil <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const [settings, categories, brands, stores, fresh, top, newest, banners, news, faqs, services] = await Promise.all([
    getSettings(), getCategories(), getBrands(), getStores(),
    getProducts("is_new=true&page_size=16"), getProducts("is_featured=true&page_size=16"), getProducts("sort=new&page_size=16"),
    getBanners(), getNews(), getFaqs(), getServices(),
  ]);
  const tops = categories.filter((c) => c.parent_id === null && c.products > 0);
  const tiles = ["wrench", "cctv"].map((icon) => services.find((g) => g.icon === icon)).filter((g) => g !== undefined);
  const withLogos = brands.filter((b) => b.products > 0);

  return (
    <>
      {/* the stores are not shown here (owner: visitors come to buy), but search engines still get them */}
      {stores.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storesLd(stores, settings))} />}
      <h1 className="sr-only">Noutbuk, kompyuter va kuzatuv kameralari Marg'ilonda</h1>

      {/* hero: banners on the left, the two service tiles on the right (phones: the tiles go under the slider) */}
      <section className="wrap mt-4 grid gap-3 lg:mt-6 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {banners.length > 0 ? (
          <BannerSlider banners={banners} />
        ) : (
          <div className="band-dark flex flex-col justify-center rounded-xl p-6 lg:p-12">
            <p className="eyebrow">TECHVISION</p>
            <p className="display mt-3 max-w-xl text-2xl lg:text-4xl">Noutbuk, kompyuter va kuzatuv kameralari Marg'ilonda</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn btn-primary btn-lg">Katalogni ko'rish</Link>
              <Link href="/service" className="btn btn-ghost-dark btn-lg">Servis</Link>
            </div>
          </div>
        )}
        {tiles.length > 0 && <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-4">{tiles.map((g) => <HeroTile key={g.id} group={g} />)}</div>}
      </section>

      <section aria-label="Afzalliklar" className="wrap mt-4 lg:mt-5">
        <ul className="grid grid-cols-2 overflow-hidden rounded-xl border border-line lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={`flex items-center gap-3 p-4 lg:p-5 ${i % 2 ? "" : "border-r border-line"} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}>
              <span className="flex size-10 flex-none items-center justify-center rounded-full bg-stage"><Icon className="size-5 text-teal-deep" aria-hidden /></span>
              <span className="leading-tight"><span className="block font-semibold">{title}</span><span className="text-sm text-muted">{text}</span></span>
            </li>
          ))}
        </ul>
      </section>

      {tops.length > 0 && (
        <Section title="Kategoriyalar" eyebrow="Katalog" link={{ href: "/catalog", label: "Butun katalog" }}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:grid-cols-7">
            {tops.map((c) => (
              <li key={c.id}>
                <Link href={`/catalog/${c.slug}`} className="card card-link group flex h-full flex-col p-2">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-stage">
                    {c.image && <Image src={mediaUrl(c.image)} alt="" fill sizes="(min-width: 1536px) 11vw, (min-width: 1024px) 19vw, (min-width: 768px) 24vw, 46vw" className="object-contain p-4 mix-blend-multiply transition-transform duration-300 motion-safe:group-hover:scale-105" />}
                  </span>
                  <span className="flex items-end justify-between gap-2 px-2 pt-3 pb-1">
                    <span className="leading-5"><span className="block font-semibold">{c.name}</span><span className="text-sm text-muted">{c.products} ta mahsulot</span></span>
                    <ChevronRight className="size-4 flex-none text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(top.items.length > 0 || newest.items.length > 0) && (
        <Section title="Top mahsulotlar" eyebrow="Tanlangan" link={{ href: "/catalog", label: "Barchasi" }}>
          <ProductRail products={top.items.length ? top.items : newest.items} label="Top mahsulotlar" />
        </Section>
      )}

      {services.length > 0 && (
        <section id="service" className="band-dark mt-14 py-12 lg:mt-20 lg:py-16">
          <div className="wrap">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
              <div>
                <p className="eyebrow">Servis markazi</p>
                <h2 className="mt-2 max-w-2xl text-2xl lg:text-[2rem]">Kompyuter va noutbuk uchun barcha xizmatlar</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/service#request" className="btn btn-primary">So'rov qoldirish</Link>
                {settings.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noreferrer" className="btn btn-ghost-dark"><Send className="size-4" aria-hidden /> Telegram</a>}
              </div>
            </div>
            <ServiceCards groups={services} dark />
          </div>
        </section>
      )}

      {(fresh.items.length > 0 || newest.items.length > 0) && (
        <Section title="Yangi mahsulotlar" eyebrow="Yangi" link={{ href: "/catalog?sort=new", label: "Barchasi" }}>
          <ProductRail products={fresh.items.length ? fresh.items : newest.items} label="Yangi mahsulotlar" />
        </Section>
      )}

      {withLogos.length > 0 && (
        <Section title="Brendlar" eyebrow="Rasmiy mahsulotlar">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-12">
            {withLogos.map((b) => (
              <li key={b.id}>
                <Link href={`/catalog?brand=${b.slug}`} title={b.name} className="card card-link group relative flex aspect-[3/2] items-center justify-center text-sm font-semibold">
                  {b.logo ? <Image src={mediaUrl(b.logo)} alt={b.name} fill sizes="(min-width: 1024px) 10vw, 30vw" className="object-contain p-4 opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0" /> : b.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(news.length > 0 || faqs.length > 0) && (
        <div className="wrap mt-14 grid gap-12 lg:mt-20 xl:grid-cols-2 xl:gap-10">
          {news.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between lg:mb-6">
                <div><p className="eyebrow mb-1.5">Yangiliklar</p><h2 className="text-xl lg:text-[1.75rem]">Do'kondan xabarlar</h2></div>
                <Link href="/news" className="flex items-center gap-0.5 text-sm font-semibold text-teal-deep hover:underline">Barchasi <ChevronRight className="size-4" aria-hidden /></Link>
              </div>
              <NewsCards news={news.slice(0, 2)} className="grid gap-4 sm:grid-cols-2" />
            </section>
          )}
          {faqs.length > 0 && (
            <section id="faq">
              <div className="mb-4 lg:mb-6"><p className="eyebrow mb-1.5">Savollar</p><h2 className="text-xl lg:text-[1.75rem]">Ko'p so'raladigan savollar</h2></div>
              <div className="card divide-y divide-line">
                {faqs.map((f) => (
                  <details key={f.id} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold lg:p-5 [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <ChevronDown className="size-5 flex-none text-muted transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="-mt-1 px-4 pb-4 whitespace-pre-line text-muted lg:px-5 lg:pb-5">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

    </>
  );
}
