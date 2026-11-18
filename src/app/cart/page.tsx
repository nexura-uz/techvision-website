import { CircleCheck, ImageIcon, Minus, Phone, Plus, ShoppingCart, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setQuantity } from "@/app/actions";
import { CheckoutForm } from "@/components/checkout-form";
import { SubmitButton } from "@/components/form-parts";
import { STOCK } from "@/components/product-card";
import { type ProductCard, api, getProducts, getSettings, getStores, mediaUrl } from "@/lib/api";
import { readCart } from "@/lib/cart";
import { formatPhone, som, telHref } from "@/lib/format";

export const metadata: Metadata = { title: "Savat", robots: { index: false } };

type Props = { searchParams: Promise<{ order?: string; total?: string }> };

function QuantityButton({ id, quantity, label, children }: { id: number; quantity: number; label: string; children: React.ReactNode }) {
  return (
    <form action={setQuantity}>
      <input type="hidden" name="product" value={id} />
      <input type="hidden" name="quantity" value={quantity} />
      <SubmitButton pending="…" className="flex size-10 cursor-pointer items-center justify-center rounded-lg hover:bg-stage" label={label}>{children}</SubmitButton>
    </form>
  );
}

const orderable = (p: ProductCard) => p.price_som !== null && (p.stock_status === "in_stock" || p.stock_status === "to_order");

export default async function CartPage({ searchParams }: Props) {
  const { order, total } = await searchParams;
  const cart = await readCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    const settings = await getSettings();
    const placed = order && /^\d+$/.test(order);
    return (
      <div className="wrap mx-auto max-w-xl py-12 text-center lg:py-20">
        {placed ? (
          <div role="status">
            <CircleCheck className="mx-auto size-16 text-teal" aria-hidden />
            <h1 className="mt-5 text-2xl lg:text-3xl">Buyurtma #{order} qabul qilindi</h1>
            {total && /^\d+$/.test(total) && <p className="mt-2 text-lg">Jami: <b>{som(Number(total))}</b></p>}
            <ol className="mx-auto mt-8 grid max-w-sm gap-3 text-left">
              {["Xodimimiz qo'ng'iroq qilib, buyurtmani tasdiqlaydi.", "Olib ketish yoki yetkazib berish vaqtini kelishamiz.", "To'lov mahsulotni olganingizda."].map((t, i) => (
                <li key={t} className="flex items-start gap-3"><span className="flex size-7 flex-none items-center justify-center rounded-full bg-ink text-sm font-bold text-teal">{i + 1}</span><span className="pt-0.5">{t}</span></li>
              ))}
            </ol>
            {settings.phone && <p className="mt-8 text-muted">Savollar bo'lsa: <a href={telHref(settings.phone)} className="font-semibold text-ink hover:underline">{formatPhone(settings.phone)}</a></p>}
            <Link href="/catalog" className="btn btn-primary btn-lg mt-6">Xaridni davom ettirish</Link>
          </div>
        ) : (
          <>
            <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-stage"><ShoppingCart className="size-9 text-muted" aria-hidden /></span>
            <h1 className="mt-5 text-2xl">Savatingiz bo'sh</h1>
            <p className="mt-2 text-muted">Katalogdan kerakli mahsulotni tanlang yoki qidiruvdan foydalaning.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalog" className="btn btn-primary btn-lg">Katalogni ko'rish</Link>
              <Link href="/service" className="btn btn-outline btn-lg">Servis</Link>
            </div>
          </>
        )}
      </div>
    );
  }

  const [list, regions, stores, settings] = await Promise.all([
    getProducts(`ids=${ids.join(",")}&page_size=60`),
    api<{ id: number; name: string }[]>("/regions"),
    getStores(),
    getSettings(),
  ]);
  const ready = list.items.filter(orderable);
  // the same sum the API makes: each item's so'm price (already rounded) × quantity
  const sum = ready.reduce((acc, p) => acc + p.price_som! * cart[p.id], 0);
  const count = ready.reduce((acc, p) => acc + cart[p.id], 0);

  return (
    <div className="wrap py-6 lg:py-8">
      <h1 className="text-2xl lg:text-[2rem]">Savat <span className="font-sans text-base font-normal text-muted lg:text-lg">{count} ta mahsulot</span></h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_26rem] lg:gap-10">
        <ul className="grid content-start gap-3">
          {list.items.map((p) => (
            <li key={p.id} className="flex gap-4 rounded-2xl border border-line p-3 lg:p-4">
              <Link href={`/product/${p.slug}`} className="relative size-20 flex-none overflow-hidden rounded-xl bg-white lg:size-28">
                {p.image ? <Image src={mediaUrl(p.image)} alt="" fill sizes="112px" className="object-contain p-1.5" /> : <ImageIcon className="absolute inset-0 m-auto size-6 text-line" aria-hidden />}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/product/${p.slug}`} className="line-clamp-2 font-medium hover:underline">{p.name}</Link>
                  <QuantityButton id={p.id} quantity={0} label="Savatdan olib tashlash"><Trash2 className="size-4 text-muted" aria-hidden /></QuantityButton>
                </div>
                {orderable(p) ? (
                  <p className={`flex items-center gap-1.5 text-xs ${STOCK[p.stock_status].className}`}><span className={`size-1.5 rounded-full ${STOCK[p.stock_status].dot}`} aria-hidden />{STOCK[p.stock_status].label}</p>
                ) : (
                  <p className="text-sm font-semibold text-red-700">Hozir buyurtma qilib bo'lmaydi: savatdan olib tashlang</p>
                )}
                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-xl border border-line">
                    <QuantityButton id={p.id} quantity={cart[p.id] - 1} label="Bittaga kamaytirish"><Minus className="size-4" aria-hidden /></QuantityButton>
                    <span className="w-8 text-center font-semibold" aria-label="Soni">{cart[p.id]}</span>
                    <QuantityButton id={p.id} quantity={cart[p.id] + 1} label="Bittaga ko'paytirish"><Plus className="size-4" aria-hidden /></QuantityButton>
                  </div>
                  {orderable(p) && (
                    <p className="text-right leading-tight">
                      {cart[p.id] > 1 && <span className="block text-xs text-muted">{cart[p.id]} × {som(p.price_som!)}</span>}
                      <b className="text-lg whitespace-nowrap">{som(p.price_som! * cart[p.id])}</b>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
          <li><Link href="/catalog" className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">← Xaridni davom ettirish</Link></li>
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {ready.length > 0 ? (
            <div className="rounded-2xl border border-line p-5 lg:p-6">
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-muted">Jami ({count} ta)</span>
                <span className="text-2xl font-bold lg:text-3xl">{som(sum)}</span>
              </p>
              <div className="mt-5 border-t border-line pt-5">
                <CheckoutForm regions={regions} stores={stores.map(({ id, name, address }) => ({ id, name, address }))} />
              </div>
            </div>
          ) : (
            <p className="rounded-2xl bg-stage p-5">Savatdagi mahsulotlarni hozir buyurtma qilib bo'lmaydi. <Link href="/catalog" className="font-semibold underline">Katalogdan tanlang</Link>.</p>
          )}
          {settings.phone && (
            <a href={telHref(settings.phone)} className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold hover:underline"><Phone className="size-4" aria-hidden /> Savol bo'lsa: {formatPhone(settings.phone)}</a>
          )}
        </div>
      </div>
    </div>
  );
}
