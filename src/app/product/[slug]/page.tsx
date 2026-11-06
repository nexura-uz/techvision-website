import { PhoneIcon, SendIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ImageSwiper } from "@/components/image-swiper";
import { AddToCart, ProductGrid } from "@/components/product-card";
import { Section } from "@/components/section";
import { api, getSettings, getSocialLinks } from "@/lib/api";
import { youtubeId } from "@/lib/pure";
import { formatPrice, jsonLd, SITE_URL, telHref } from "@/lib/site";
import type { Paged, Product } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

const getProduct = (slug: string) => api<Product>(`products/${encodeURIComponent(slug)}/`);

function describe(product: Product) {
    const specs = product.specs.map((s) => `${s.name}: ${s.value}`).join(", ");
    return (product.short_description || product.description || specs || `${product.name}, TECHVISION do'konida.`).slice(0, 160);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProduct((await params).slug);
    return {
        title: product.name,
        description: describe(product),
        alternates: { canonical: `/product/${product.slug}` },
        openGraph: { title: product.name, description: describe(product), images: product.images.map((i) => i.image) },
    };
}

function Video({ title, url }: { title: string; url: string }) {
    const id = youtubeId(url);
    if (!id) return <a href={url} target="_blank" rel="noreferrer" className="link inline-flex min-h-11 items-center">{title}</a>;
    return (
        <div>
            <h3 className="mb-2 font-medium">{title}</h3>
            <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={title}
                loading="lazy"
                allowFullScreen
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                className="aspect-video w-full border-0 bg-paper"
            />
        </div>
    );
}

export default async function Page({ params }: Props) {
    const product = await getProduct((await params).slug);
    const [settings, socials, related] = await Promise.all([
        getSettings(),
        getSocialLinks(),
        product.category ? api<Paged<Product>>(`products/?category=${product.category}&is_in_stock=true&page_size=5`) : null,
    ]);
    const usdRate = settings.usd_rate;
    const telegram = socials.find((link) => link.platform === "telegram");
    const others = related?.results.filter((p) => p.id !== product.id).slice(0, 4) ?? [];
    const videos = [
        { title: "Obzor videosi", url: product.overview_video_url },
        { title: "Qo'llanma videosi", url: product.tutorial_video_url },
    ].filter((video) => video.url);
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: describe(product),
        image: product.images.map((i) => i.image),
        ...(product.brand_details && { brand: { "@type": "Brand", name: product.brand_details.name } }),
        offers: {
            "@type": "Offer",
            url: `${SITE_URL}/product/${product.slug}`,
            // Must match the price visitors see, or search engines flag the listing.
            ...(usdRate
                ? { price: Math.round(Number(product.final_price) * Number(usdRate)), priceCurrency: "UZS" }
                : { price: product.final_price, priceCurrency: "USD" }),
            availability: `https://schema.org/${product.is_in_stock ? "InStock" : "OutOfStock"}`,
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
            <div className="wrap lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-10">
                <div>
                    {product.category_details && (
                        <Link href={`/categories/${product.category_details.slug}`} className="link inline-flex min-h-11 items-center lg:mb-2">{product.category_details.name}</Link>
                    )}
                    {product.images.length > 0 ? (
                        <ImageSwiper
                            slides={product.images.map((image) => ({ id: image.id, image: image.image, alt: product.name }))}
                            frame="aspect-square border border-line"
                            fit="object-contain"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                    ) : (
                        <div className="aspect-square bg-paper" />
                    )}
                </div>

                <div className="mt-4 lg:mt-11">
                    <h1 className="h2">{product.name}</h1>
                    {product.brand_details && <Link href={`/brands/${product.brand_details.slug}`} className="link inline-flex min-h-11 items-center">{product.brand_details.name}</Link>}
                    {product.short_description && <p className="mt-1 text-muted">{product.short_description}</p>}

                    <div className="mt-4">
                        {product.discount > 0 && product.is_in_stock && (
                            <p className="text-muted"><s>{formatPrice(product.price, usdRate)}</s> <span className="font-medium text-teal-deep">-{product.discount}%</span></p>
                        )}
                        <p className="h1">{formatPrice(product.final_price, usdRate)}</p>
                        <p className={`mt-1 font-medium ${product.is_in_stock ? "text-teal-deep" : "text-muted"}`}>{product.is_in_stock ? "Sotuvda bor" : "Hozir sotuvda yo'q"}</p>
                        {product.warranty && <p className="text-muted">Kafolat: {product.warranty}</p>}
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        {product.is_in_stock && <AddToCart product={product} />}
                        {telegram ? (
                            <a href={telegram.url} target="_blank" rel="noreferrer" className="btn btn-secondary !w-full"><SendIcon size={18} aria-hidden /> Telegramda so'rash</a>
                        ) : settings.phone && (
                            <a href={telHref(settings.phone)} className="btn btn-secondary !w-full"><PhoneIcon size={18} aria-hidden /> Qo'ng'iroq qilish</a>
                        )}
                    </div>

                    {product.specs.length > 0 && (
                        <section className="mt-8">
                            <h2 className="h2 mb-3">Xususiyatlari</h2>
                            <dl className="border-t border-line">
                                {product.specs.map((spec) => (
                                    <div key={spec.name} className="flex min-h-11 justify-between gap-4 border-b border-line py-2">
                                        <dt className="text-muted">{spec.name}</dt>
                                        <dd className="text-right font-medium">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}
                </div>
            </div>

            {product.description && (
                <Section title="Tavsif"><p className="max-w-3xl whitespace-pre-wrap">{product.description}</p></Section>
            )}

            {videos.length > 0 && (
                <Section title="Videolar">
                    <div className="grid gap-6 md:grid-cols-2">
                        {videos.map((video) => <Video key={video.url} {...video} />)}
                    </div>
                </Section>
            )}

            {others.length > 0 && (
                <Section title="O'xshash mahsulotlar">
                    <ProductGrid products={others} usdRate={usdRate} />
                </Section>
            )}
        </>
    );
}
