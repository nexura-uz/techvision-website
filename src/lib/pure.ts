export type Cart = Record<string, number>;

export const MAX_CART_LINES = 50;
export const MAX_QUANTITY = 999;

/** The cookie can be edited by the visitor, so only sane product ids and quantities survive. */
export function parseCart(raw: string | undefined): Cart {
    let data: unknown;
    try {
        data = JSON.parse(raw ?? "{}");
    } catch {
        return {};
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
    const cart: Cart = {};
    for (const [id, quantity] of Object.entries(data).slice(0, MAX_CART_LINES)) {
        if (/^[1-9]\d{0,17}$/.test(id) && Number.isInteger(quantity) && (quantity as number) >= 1) {
            cart[id] = Math.min(quantity as number, MAX_QUANTITY);
        }
    }
    return cart;
}

export function youtubeId(url: string) {
    return url.match(/(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})(?:[?&/#]|$)/)?.[1] ?? null;
}

/** Behind one proxy the last entry is the address that proxy saw; earlier ones are client-supplied. */
export function clientIp(forwardedFor: string | null) {
    return forwardedFor?.split(",").pop()?.trim() || null;
}
