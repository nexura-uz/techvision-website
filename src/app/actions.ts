"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { readCart, writeCart } from "@/lib/cart";
import { clientIp, MAX_CART_LINES, MAX_QUANTITY } from "@/lib/pure";
import type { Paged, Product } from "@/lib/types";

function productId(formData: FormData) {
    const id = String(formData.get("product"));
    return /^[1-9]\d{0,17}$/.test(id) ? id : null;
}

export async function addToCart(formData: FormData) {
    const id = productId(formData);
    if (!id) return;
    const cart = await readCart();
    if (!cart[id] && Object.keys(cart).length >= MAX_CART_LINES) return;
    cart[id] = Math.min((cart[id] ?? 0) + 1, MAX_QUANTITY);
    await writeCart(cart);
}

export async function setQuantity(formData: FormData) {
    const id = productId(formData);
    const quantity = Number(formData.get("quantity"));
    if (!id || !Number.isInteger(quantity)) return;
    const cart = await readCart();
    if (quantity < 1) delete cart[id];
    else if (cart[id]) cart[id] = Math.min(quantity, MAX_QUANTITY);
    await writeCart(cart);
}

export interface OrderState {
    formError?: string;
    errors?: Record<string, string[] | undefined>;
    values?: { full_name: string; phone: string; region: string };
}

export async function placeOrder(_: OrderState, formData: FormData): Promise<OrderState> {
    const values = {
        full_name: String(formData.get("full_name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        region: String(formData.get("region") ?? ""),
    };
    const failed = (formError: string): OrderState => ({ formError, values });

    const cart = await readCart();
    const ids = Object.keys(cart);
    if (ids.length === 0) return failed("Savatingiz bo'sh.");

    let order: { id: number };
    try {
        const listed = await fetch(`${API_URL}/api/products/?ids=${ids.join(",")}&page_size=100`, { cache: "no-store" });
        if (!listed.ok) return failed("Buyurtma yuborilmadi. Qayta urinib ko'ring yoki qo'ng'iroq qiling.");
        const { results } = (await listed.json()) as Paged<Product>;
        const items = results.filter((p) => p.is_in_stock).map((p) => ({ product: p.id, quantity: cart[p.id] }));
        if (items.length < ids.length) {
            await writeCart(Object.fromEntries(items.map((item) => [item.product, item.quantity])));
            return failed("Ba'zi mahsulotlar sotuvda qolmadi va savatdan olindi. Savatni tekshirib, qayta yuboring.");
        }

        // The API limits orders per visitor, so it must see the visitor and not this server.
        const ip = clientIp((await headers()).get("x-forwarded-for"));
        const response = await fetch(`${API_URL}/api/orders/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...(ip && { "X-Forwarded-For": ip }) },
            body: JSON.stringify({ ...values, items }),
            cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));
        if (response.status === 429) return failed("Juda ko'p urinish bo'ldi. Bir ozdan keyin qayta yuboring yoki qo'ng'iroq qiling.");
        if (response.status === 503) return failed(data.detail);
        if (response.status === 400) return { errors: data, values, ...(data.items && { formError: "Savatni tekshirib, qayta yuboring." }) };
        if (!response.ok) return failed("Buyurtma yuborilmadi. Qayta urinib ko'ring yoki qo'ng'iroq qiling.");
        order = data;
    } catch {
        return failed("Serverga ulanib bo'lmadi. Qayta urinib ko'ring yoki qo'ng'iroq qiling.");
    }

    await writeCart({});
    redirect(`/cart?order=${order.id}`);
}
