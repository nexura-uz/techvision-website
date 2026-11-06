import { CheckIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import type { Product } from "@/lib/types";

/** Two-up on a phone, so a whole row is visible without swiping. */
export function ProductGrid({ products, usdRate }: { products: Product[]; usdRate?: string }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} usdRate={usdRate} />)}
        </div>
    );
}

export async function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
    const inCart = (await getCart())[product.id];
    if (inCart) {
        return (
            <Link href="/cart" className={`btn btn-secondary ${compact ? "!px-2 text-sm" : ""}`}>
                <CheckIcon size={18} aria-hidden /> Savatda
            </Link>
        );
    }
    return (
        <form action={addToCart}>
            <input type="hidden" name="product" value={product.id} />
            <SubmitButton pendingText="Qo'shilmoqda..." aria-label={`${product.name}: savatga qo'shish`} className={`btn btn-primary !w-full ${compact ? "!px-2 text-sm" : ""}`}>
                <ShoppingCartIcon size={18} aria-hidden /> Savatga
            </SubmitButton>
        </form>
    );
}

function ProductCard({ product, usdRate }: { product: Product; usdRate?: string }) {
    return (
        <article className="card flex flex-col border border-line bg-white">
            <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-square overflow-hidden">
                    {product.images[0] && (
                        <Image src={product.images[0].image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-contain" />
                    )}
                </div>
                <div className="flex flex-1 flex-col px-3 pt-3">
                    <h3 className="line-clamp-2 min-h-12 leading-6 font-medium">{product.name}</h3>
                    <p className="mt-auto min-h-6 pt-2 text-sm leading-5 text-muted">
                        {product.is_in_stock && product.discount > 0 && <><s>{formatPrice(product.price, usdRate)}</s> <span className="font-medium text-teal-deep">-{product.discount}%</span></>}
                    </p>
                    <p className={`text-lg leading-7 font-medium ${product.is_in_stock ? "" : "text-muted"}`}>{formatPrice(product.final_price, usdRate)}</p>
                </div>
            </Link>
            <div className="p-3">
                {product.is_in_stock ? <AddToCart product={product} compact /> : <p className="flex min-h-12 items-center justify-center text-center text-sm leading-5 text-muted">Hozir sotuvda yo'q</p>}
            </div>
        </article>
    );
}
