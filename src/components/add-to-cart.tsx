import { Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { addToCart } from "@/app/actions";
import { type StockStatus } from "@/lib/api";
import { readCart } from "@/lib/cart";
import { CartAdded } from "./cart-toast";
import { SubmitButton } from "./form-parts";

/** "Savatga" for products that can be ordered and have a price; "Savatda" once added. A plain form, so it works
 *  before the page's scripts load. `icon`: the product cards' small square button (owner's choice, 2026-11-18). */
export async function AddToCart({ id, name, stock, priced, large, icon }: { id: number; name: string; stock: StockStatus; priced: boolean; large?: boolean; icon?: boolean }) {
  if (!priced || (stock !== "in_stock" && stock !== "to_order")) return null;
  if (icon) {
    const square = "flex size-9 items-center justify-center rounded-lg transition-colors sm:size-11";
    if ((await readCart())[id]) {
      return <Link href="/cart" aria-label="Savatda: savatni ochish" title="Savatda" className={`${square} bg-teal/15 text-teal-deep`}><Check className="size-5" aria-hidden /></Link>;
    }
    return (
      <form action={addToCart}>
        <input type="hidden" name="product" value={id} />
        <CartAdded name={name} />
        <SubmitButton pending="…" className={`${square} bg-teal-deep text-white hover:bg-teal-darker`} label="Savatga qo'shish">
          <ShoppingCart className="size-5" aria-hidden />
        </SubmitButton>
      </form>
    );
  }
  const size = large ? "w-full" : "w-full min-h-10 px-2 text-sm";
  if ((await readCart())[id]) {
    return <Link href="/cart" className={`btn btn-outline ${size}`}><Check className="size-4 text-teal-deep" aria-hidden /> Savatda</Link>;
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="product" value={id} />
      <CartAdded name={name} />
      <SubmitButton pending="Qo'shilmoqda..." className={`btn btn-primary ${size}`}>
        <ShoppingCart className="size-4" aria-hidden /> Savatga
      </SubmitButton>
    </form>
  );
}
