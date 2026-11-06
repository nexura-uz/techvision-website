import { ChevronRightIcon, PhoneIcon, SendIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageSwiper } from "@/components/image-swiper";
import { ProductGrid } from "@/components/product-card";
import { CategoryList, NewsList, Section } from "@/components/section";
import { api, getSettings, getSocialLinks } from "@/lib/api";
import { formatPhone, jsonLd, mapHref, storeJsonLd, telHref } from "@/lib/site";
import type { Banner, Contact, Faq, NamedImage, News, Paged, Product } from "@/lib/types";

const HEADING = "Margilonda kompyuter do'koni va servis";
const DESCRIPTION = "Noutbuk, kompyuter, monoblok, monitor, printer va kuzatuv kameralari.";

export const metadata: Metadata = {
    title: { absolute: "TECHVISION: kompyuter do'koni va servis markazi" },
    description: DESCRIPTION,
    keywords: "kompyuter, noutbuk, kuzatuv kamerasi, printer, margilon",
};

const SERVICES = [
    "Ta'mirlash va diagnostika",
    "Chang va termopastadan tozalash",
    "SSD va RAM qo'yish",
    "Windows o'rnatish",
    "Kuzatuv kamerasi o'rnatish",
];

export default async function Page() {
    const [settings, socials, banners, categories, newProducts, topProducts, news, faqs, contacts] = await Promise.all([
        getSettings(),
        getSocialLinks(),
        api<Banner[]>("banners/"),
        api<NamedImage[]>("categories/"),
        api<Paged<Product>>("products/?is_new=true&page_size=4"),
        api<Paged<Product>>("products/?is_featured=true&page_size=4"),
        api<Paged<News>>("news/?page_size=3"),
        api<Faq[]>("faqs/"),
        api<Contact[]>("contacts/"),
    ]);
    const usdRate = settings.usd_rate;
    const store = contacts[0];
    const telegram = socials.find((link) => link.platform === "telegram");
    // Questions about repairs go straight to the shop: Telegram first, a call if none is set.
    const serviceContact = telegram ? (
        <a href={telegram.url} target="_blank" rel="noreferrer" className="btn btn-ink"><SendIcon size={18} aria-hidden /> Telegramda yozish</a>
    ) : settings.phone ? (
        <a href={telHref(settings.phone)} className="btn btn-ink"><PhoneIcon size={18} aria-hidden /> Qo'ng'iroq qilish</a>
    ) : null;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storeJsonLd(settings, socials))} />

            {banners.length > 0 && (
                <div className="wrap lg:pt-6">
                    <ImageSwiper slides={banners.map((b) => ({ id: b.id, image: b.image, href: b.url, alt: "Aksiya" }))} />
                </div>
            )}
            <div className="wrap mt-2 lg:mt-6">
                <h1 className="h1 max-w-3xl">{HEADING}</h1>
                <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">
                    {DESCRIPTION} <span className="whitespace-nowrap">{settings.working_hours}</span>
                </p>
                <Link href="/categories" className="btn btn-primary mt-5">Katalogni ko'rish</Link>
            </div>

            {categories.length > 0 && (
                <Section title="Kategoriyalar">
                    <CategoryList categories={categories} />
                </Section>
            )}

            {newProducts.results.length > 0 && (
                <Section title="Yangi mahsulotlar">
                    <ProductGrid products={newProducts.results} usdRate={usdRate} />
                    <Link href="/categories?type=new" className="btn btn-secondary mt-4 lg:mt-6">Yangilarini ko'rish</Link>
                </Section>
            )}

            <section id="service" className="mt-12 scroll-mt-14 bg-teal py-10 lg:mt-20 lg:py-16">
                <div className="wrap lg:grid lg:grid-cols-2 lg:gap-6">
                    <div>
                        <h2 className="h2">Servis markazi</h2>
                        <p className="mt-2 max-w-md">Noutbuk, kompyuter, printer va kameralarni tuzatamiz.</p>
                        <div className="mt-5 hidden lg:block">{serviceContact}</div>
                    </div>
                    <ul className="mt-4 border-t border-ink/30 lg:mt-0">
                        {SERVICES.map((service) => (
                            <li key={service} className="flex min-h-12 items-center border-b border-ink/30 font-medium">{service}</li>
                        ))}
                    </ul>
                    <div className="mt-5 lg:hidden">{serviceContact}</div>
                </div>
            </section>

            {topProducts.results.length > 0 && (
                <Section title="Top mahsulotlar">
                    <ProductGrid products={topProducts.results} usdRate={usdRate} />
                    <Link href="/categories?type=top" className="btn btn-secondary mt-4 lg:mt-6">Toplarini ko'rish</Link>
                </Section>
            )}

            {store && (
                <Section title="Do'kon manzili" id="visit">
                    <p className="type-moment"><a href={mapHref(store)} target="_blank" rel="noreferrer" className="decoration-2 underline-offset-8 hover:underline">{store.address.replace(/ shahri$/, "")}</a></p>
                    <div className="mt-4 max-w-md">
                        <p className="text-lg">{store.region_details.name}, {store.address}</p>
                        {settings.working_hours && <p className="text-muted">{settings.working_hours}</p>}
                        {store.phone_1 && <a href={telHref(store.phone_1)} className="flex min-h-11 items-center font-medium hover:underline">{formatPhone(store.phone_1)}</a>}
                        <a href={mapHref(store)} target="_blank" rel="noreferrer" className="btn btn-secondary mt-4">Xaritada ochish</a>
                    </div>
                </Section>
            )}

            {news.results.length > 0 && (
                <Section title="Yangiliklar">
                    <NewsList items={news.results} />
                    <Link href="/news" className="link mt-4 inline-flex min-h-11 items-center">Barcha yangiliklarni o'qish</Link>
                </Section>
            )}

            {faqs.length > 0 && (
                <Section title="Savollar va javoblar">
                    <div className="max-w-3xl border-t border-line">
                        {faqs.map((faq) => (
                            <details key={faq.id} className="group border-b border-line">
                                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 font-medium [&::-webkit-details-marker]:hidden">
                                    {faq.question}
                                    <ChevronRightIcon size={20} aria-hidden className="shrink-0 text-muted transition-transform group-open:rotate-90" />
                                </summary>
                                <p className="pb-4 whitespace-pre-wrap text-muted">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </Section>
            )}
        </>
    );
}
