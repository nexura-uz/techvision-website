"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { MAX_LINES, MAX_QUANTITY, readCart, writeCart } from "@/lib/cart";

const productId = (form: FormData) => {
  const id = String(form.get("product") ?? "");
  return /^\d{1,12}$/.test(id) ? id : null;
};

export async function addToCart(form: FormData) {
  const id = productId(form);
  if (!id) return;
  const cart = await readCart();
  if (!cart[id] && Object.keys(cart).length >= MAX_LINES) return;
  cart[id] = Math.min((cart[id] ?? 0) + 1, MAX_QUANTITY);
  await writeCart(cart);
}

export async function setQuantity(form: FormData) {
  const id = productId(form);
  const quantity = Number(form.get("quantity"));
  if (!id || !Number.isInteger(quantity)) return;
  const cart = await readCart();
  if (quantity < 1) delete cart[id];
  else if (cart[id]) cart[id] = Math.min(quantity, MAX_QUANTITY);
  await writeCart(cart);
}

/** POST to the API with the visitor's own address, so its per-visitor limits count this visitor, not this server. */
async function post(path: string, body: unknown) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  return fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(ip && { "X-Forwarded-For": ip }) },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

const fieldErrors = (detail: unknown) =>
  Array.isArray(detail) ? new Set(detail.map((e: { loc?: unknown[] }) => String(e.loc?.[1] ?? ""))) : new Set<string>();

export type FormState = { error?: string; fields?: string[]; values?: Record<string, string>; done?: boolean };

const TRY_AGAIN = "Yuborilmadi. Qayta urinib ko'ring yoki qo'ng'iroq qiling.";

export async function placeOrder(_: FormState, form: FormData): Promise<FormState> {
  const values = Object.fromEntries(["full_name", "phone", "delivery", "region_id", "address", "comment"].map((k) => [k, String(form.get(k) ?? "").trim()]));
  const failed = (error: string, fields: string[] = []): FormState => ({ error, fields, values });
  const cart = await readCart();
  if (Object.keys(cart).length === 0) return failed("Savatingiz bo'sh.");
  // "pickup:<store name>" or "delivery". A pickup has no region; its address line says which shop, so staff (admin,
  // Telegram) see it where an address would be, and the comment keeps only the customer's own note
  const pickup = values.delivery.startsWith("pickup") ? values.delivery.slice(7) || "do'kon" : "";
  if (!pickup && !values.region_id) return failed("Viloyatni tanlang.", ["region_id"]);

  let order: { id: number; total_som: number };
  try {
    const response = await post("/orders", {
      full_name: values.full_name, phone: `+998${values.phone}`, region_id: pickup ? null : Number(values.region_id),
      address: pickup ? `Olib ketadi: ${pickup}` : values.address, comment: values.comment,
      items: Object.entries(cart).map(([id, quantity]) => ({ product_id: Number(id), quantity })),
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 422 && body.detail?.code === "unavailable") {
      // products sold out or hidden since they were added: take them out and let the buyer look again
      for (const id of body.detail.product_ids) delete cart[String(id)];
      await writeCart(cart);
      return failed("Ba'zi mahsulotlar sotuvda qolmadi va savatdan olib tashlandi. Savatni tekshirib, qayta yuboring.");
    }
    if (response.status === 422) {
      const bad = [...fieldErrors(body.detail), ...(body.detail === "bad_region" ? ["region_id"] : [])];
      return failed("Belgilangan maydonlarni tekshiring.", bad);
    }
    if (response.status === 429) return failed("Juda ko'p buyurtma yuborildi. Birozdan keyin qayta urining yoki qo'ng'iroq qiling.");
    if (response.status === 503) return failed("Hozir onlayn buyurtma qabul qilinmayapti. Iltimos, qo'ng'iroq qiling.");
    if (!response.ok) return failed(TRY_AGAIN);
    order = body;
  } catch {
    return failed(TRY_AGAIN);
  }
  await writeCart({});
  redirect(`/cart?order=${order.id}&total=${order.total_som}`);
}

export async function sendRequest(_: FormState, form: FormData): Promise<FormState> {
  const values = Object.fromEntries(["type", "name", "phone", "message", "note"].map((k) => [k, String(form.get(k) ?? "").trim()]));
  const failed = (error: string, fields: string[] = []): FormState => ({ error, fields, values });
  // the tapped choices ("Noutbuk ta'miri: Ekran almashtirish") and the visitor's optional note
  const message = [values.message, values.note].filter(Boolean).join("\n\n").slice(0, 2000);
  try {
    const response = await post("/requests", { type: values.type, name: values.name, phone: `+998${values.phone}`, message });
    if (response.status === 422) return failed("Belgilangan maydonlarni tekshiring.", [...fieldErrors((await response.json()).detail)]);
    if (response.status === 429) return failed("Juda ko'p so'rov yuborildi. Birozdan keyin qayta urining yoki qo'ng'iroq qiling.");
    if (!response.ok) return failed(TRY_AGAIN);
  } catch {
    return failed(TRY_AGAIN);
  }
  return { done: true }; // the form says "received" where it is
}

export type QuickState = FormState & { order?: number };

/** "Bir klikda xarid": one product, a name and a phone; no region or address (staff call back for those). The cart
 *  is not touched. */
export async function quickOrder(_: QuickState, form: FormData): Promise<QuickState> {
  const values = { full_name: String(form.get("full_name") ?? "").trim(), phone: String(form.get("phone") ?? "").trim() };
  const failed = (error: string, fields: string[] = []): QuickState => ({ error, fields, values });
  const id = productId(form);
  if (!id) return failed(TRY_AGAIN);
  try {
    const response = await post("/orders", {
      full_name: values.full_name, phone: `+998${values.phone}`, comment: "Bir klikda xarid", items: [{ product_id: id, quantity: 1 }],
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 422 && body.detail?.code === "unavailable") return failed("Bu mahsulot hozir sotuvda yo'q. Qo'ng'iroq qiling.");
    if (response.status === 422) return failed("Ism va telefonni tekshiring.", [...fieldErrors(body.detail)]);
    if (response.status === 429) return failed("Juda ko'p buyurtma yuborildi. Birozdan keyin qayta urining yoki qo'ng'iroq qiling.");
    if (response.status === 503) return failed("Hozir onlayn buyurtma qabul qilinmayapti. Iltimos, qo'ng'iroq qiling.");
    if (!response.ok) return failed(TRY_AGAIN);
    return { order: body.id };
  } catch {
    return failed(TRY_AGAIN);
  }
}
