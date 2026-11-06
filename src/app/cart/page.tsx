import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setQuantity } from "@/app/actions";
import { CheckoutForm } from "@/components/checkout-form";
import { PageHead } from "@/components/section";
import { SubmitButton } from "@/components/submit-button";
import { api, getSettings } from "@/lib/api";
import { getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import type { Paged, Product, Region } from "@/lib/types";

export const metadata: Metadata = { title: "Savat", robots: { index: false } };

function QuantityButton({ product, quantity, label, children }: { product: Product; quantity: number; label: string; children: React.ReactNode }) {
    return (
        <form action={setQuantity}>
            <input type="hidden" name="product" value={product.id} />
            <SubmitButton name="quantity" value={quantity} aria-label={`${product.name}: ${label}`} className="flex size-11 cursor-pointer items-center justify-center active:bg-paper">
                {children}
            </SubmitButton>
        </form>
    );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
    const { order } = await searchParams;
    const cart = await getCart();
    const ids = Object.keys(cart);

    if (ids.length === 0) {
        return (
            <div className="wrap">
                {order && /^\d+$/.test(order) ? (
                    <div className="bg-teal p-6 lg:mt-6 lg:p-8" role="status">
                        <h1 className="h1">Buyurtma #{order} qabul qilindi</h1>
                        <p className="mt-3 text-lg">Xodimimiz tez orada qo'ng'iroq qiladi.</p>
                        <Link href="/categories" className="btn btn-ink mt-5">Katalogga qaytish</Link>
                    </div>
                ) : (
                    <>
                        <PageHead title="Savat" />
                        <p className="text-lg">Savatingiz bo'sh.</p>
                        <Link href="/categories" className="btn btn-primary mt-4">Katalogni ko'rish</Link>
                    </>
                )}
            </div>
        );
    }

    const [products, settings, regions] = await Promise.all([
        api<Paged<Product>>(`products/?ids=${ids.join(",")}&page_size=100`),
        getSettings(),
        api<Region[]>("regions/"),
    ]);
    const usdRate = settings.usd_rate;
    const available = products.results.filter((p) => p.is_in_stock);
    const total = available.reduce((sum, p) => sum + Number(p.final_price) * cart[p.id], 0);

    return (
        <div className="wrap">
            <PageHead title="Savat" />
            <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10">
                <ul className="border-t border-line">
                    {products.results.map((product) => (
                        <li key={product.id} className="border-b border-line py-3">
                            <div className="flex gap-3">
                                <Link href={`/product/${product.slug}`} className="relative size-20 shrink-0 overflow-hidden">
                                    {product.images[0] && <Image src={product.images[0].image} alt="" fill sizes="80px" className="object-contain" />}
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <Link href={`/product/${product.slug}`} className="line-clamp-2 leading-6 font-medium hover:underline">{product.name}</Link>
                                    {product.is_in_stock ? <p className="text-muted">{formatPrice(product.final_price, usdRate)}</p> : <p className="font-medium text-red-700">Sotuvda qolmadi</p>}
                                </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <div className="flex items-center">
                                    <QuantityButton product={product} quantity={cart[product.id] - 1} label="bittaga kamaytirish"><MinusIcon size={18} aria-hidden /></QuantityButton>
                                    <span className="w-10 text-center font-medium">{cart[product.id]}</span>
                                    <QuantityButton product={product} quantity={cart[product.id] + 1} label="bittaga ko'paytirish"><PlusIcon size={18} aria-hidden /></QuantityButton>
                                    <QuantityButton product={product} quantity={0} label="savatdan olish"><Trash2Icon size={18} aria-hidden /></QuantityButton>
                                </div>
                                {product.is_in_stock && <p className="text-lg font-medium whitespace-nowrap">{formatPrice(Number(product.final_price) * cart[product.id], usdRate)}</p>}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 lg:mt-0">
                    {available.length > 0 ? (
                        <>
                            <p className="mb-4 flex items-baseline justify-between gap-3 border-b border-ink pb-3">
                                <span className="text-lg">Jami</span>
                                <span className="h2 font-medium whitespace-nowrap">{formatPrice(total, usdRate)}</span>
                            </p>
                            <CheckoutForm regions={regions} />
                        </>
                    ) : (
                        <p className="bg-paper p-4">Savatdagi mahsulotlar sotuvda qolmagan. <Link href="/categories" className="link">Katalogdan tanlang</Link>.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
