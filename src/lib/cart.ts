import { cookies } from "next/headers";

// product id → quantity, in an httpOnly cookie: no account needed, and page scripts can't read or change it
export type Cart = Record<string, number>;

const COOKIE = "cart";
export const MAX_LINES = 50; // the API takes at most 50 lines per order
export const MAX_QUANTITY = 99;

export async function readCart(): Promise<Cart> {
  try {
    const raw = JSON.parse((await cookies()).get(COOKIE)?.value ?? "{}");
    // keep only sane entries: the cookie comes back from the browser and could be anything
    return Object.fromEntries(
      Object.entries(raw)
        .filter(([id, qty]) => /^\d{1,12}$/.test(id) && Number.isInteger(qty) && (qty as number) >= 1)
        .slice(0, MAX_LINES)
        .map(([id, qty]) => [id, Math.min(qty as number, MAX_QUANTITY)]),
    );
  } catch {
    return {};
  }
}

export async function writeCart(cart: Cart) {
  (await cookies()).set(COOKIE, JSON.stringify(cart), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production",
  });
}

export const cartCount = (cart: Cart) => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
