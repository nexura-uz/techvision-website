import { ImageIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { type ProductCard as Card, type StockStatus, mediaUrl } from "@/lib/api";
import { som } from "@/lib/format";
import { AddToCart } from "./add-to-cart";
import { CardPhotos } from "./card-photos";
import { Rail } from "./rail";

export const STOCK: Record<StockStatus, { label: string; className: string; dot: string }> = {
  in_stock: { label: "Sotuvda bor", className: "text-teal-deep", dot: "bg-teal" },
  to_order: { label: "Sotuvda bor", className: "text-teal-deep", dot: "bg-teal" }, // the API already shows to_order as in_stock; never say "to order"
  on_the_way: { label: "Yo'lda", className: "text-amber-700", dot: "bg-amber-500" },
  none: { label: "Hozir sotuvda yo'q", className: "text-muted", dot: "bg-muted" },
};

/** A calm card (owner, 2026-11-18: "more natural"): the photo on white, brand, name, key specs, the price and a dot
 *  for stock, a thin border instead of a shadow; the small cart button. Warranty and the brand logo are on the product
 *  page, so the card stays light. */
export function ProductCard({ product }: { product: Card }) {
  const discount = product.price_som && product.old_price_som ? Math.round((1 - product.price_som / product.old_price_som) * 100) : 0;
  const stock = STOCK[product.stock_status];
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-line/80 bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink/20 hover:shadow-[var(--shadow-card)]">
      <Link href={`/product/${product.slug}`} className="flex flex-1 flex-col rounded-2xl">
        <div className="relative aspect-square overflow-hidden rounded-t-2xl">
          {product.image ? (
            <CardPhotos urls={(product.images?.length ? product.images : [product.image]).map(mediaUrl)} alt={product.name}
              sizes="(min-width: 1536px) 15vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw" />
          ) : (
            <ImageIcon className="absolute inset-0 m-auto size-10 text-ink/15" aria-hidden />
          )}
          <div className="absolute top-3 left-3 flex gap-1">
            {discount > 0 && <span className="badge rounded-full bg-red-600 text-white">-{discount}%</span>}
            {product.is_new && <span className="badge rounded-full bg-teal/15 text-teal-deep">Yangi</span>}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-3.5 pb-3.5 lg:px-4 lg:pb-4">
          {product.brand && <p className="text-xs text-muted">{product.brand}</p>}
          <h3 className="mt-0.5 line-clamp-2 min-h-11 text-[0.9375rem] leading-[1.375rem] font-medium">{product.name}</h3>
          {product.specs.length > 0 && <p className="mt-1 line-clamp-1 text-xs text-muted">{product.specs.slice(0, 2).join(" · ")}</p>}
          <div className="mt-auto pt-3 sm:pr-12">
            {product.old_price_som && <p className="text-xs text-muted line-through">{som(product.old_price_som)}</p>}
            <p className="text-[0.95rem] leading-tight font-bold whitespace-nowrap sm:text-lg">{product.price_som ? som(product.price_som) : "Narxini so'rang"}</p>
            <p className={`mt-1 flex items-center gap-1.5 text-xs ${stock.className}`}><span className={`size-1.5 rounded-full ${stock.dot}`} aria-hidden />{stock.label}</p>
          </div>
        </div>
      </Link>
      {/* outside the link (a button inside a link is not allowed): on the photo's corner on phones, where the price
          needs the card's full width; at the card's bottom-right corner from tablets up */}
      <div className="absolute top-3 right-3 empty:hidden sm:top-auto sm:right-3 sm:bottom-3 lg:right-4 lg:bottom-4">
        <AddToCart id={product.id} name={product.name} stock={product.stock_status} priced={product.price_som !== null} icon />
      </div>
    </article>
  );
}

/** Two cards across on a phone, up to six on wide screens; `narrow` (next to the catalog's filter sidebar) one fewer,
 *  so prices never run under the cart button. */
export function ProductGrid({ products, narrow = false }: { products: Card[]; narrow?: boolean }) {
  const columns = narrow ? "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${columns}`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

/** One row of cards that scrolls sideways (swipe on phones, arrows on desktop): the home page's product rows. */
export function ProductRail({ products, label }: { products: Card[]; label: string }): ReactNode {
  return (
    <Rail label={label}>
      {products.map((p) => (
        <li key={p.id} className="w-[46%] flex-none snap-start sm:w-[31%] md:w-[30%] lg:w-[23.5%] xl:w-[19%] 2xl:w-[16%]">
          <ProductCard product={p} />
        </li>
      ))}
    </Rail>
  );
}
