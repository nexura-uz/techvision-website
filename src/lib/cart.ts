import { cookies } from "next/headers";
import { cache } from "react";
import { parseCart, type Cart } from "./pure";

const COOKIE = "techvision_cart";

export async function readCart(): Promise<Cart> {
    return parseCart((await cookies()).get(COOKIE)?.value);
}

/** One read per render, however many product cards ask. */
export const getCart = cache(readCart);

export async function writeCart(cart: Cart) {
    (await cookies()).set(COOKIE, JSON.stringify(cart), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
    });
}
