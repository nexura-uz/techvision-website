import { API_URL, type ProductList, mediaUrl } from "@/lib/api";

// search as you type: the browser asks this site, this site asks the API (the browser never talks to the API itself)
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return Response.json({ total: 0, items: [] });
  const response = await fetch(`${API_URL}/products?${new URLSearchParams({ q, page_size: "6" })}`, { next: { revalidate: 60, tags: ["api"] } });
  if (!response.ok) return Response.json({ total: 0, items: [] }, { status: 502 });
  const { total, items }: ProductList = await response.json();
  return Response.json({ total, items: items.map(({ id, name, slug, brand, image, price_som }) => ({ id, name, slug, brand, image: image && mediaUrl(image), price_som })) });
}
