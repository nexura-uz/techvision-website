import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import type { NamedImage, News, Paged, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

async function all<T>(path: string) {
    const rows: T[] = [];
    for (let page = 1; ; page++) {
        const result = await api<Paged<T>>(`${path}/?page_size=100&page=${page}`);
        rows.push(...result.results);
        if (!result.next) return rows;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, news, categories, brands] = await Promise.all([
        all<Product>("products"),
        all<News>("news"),
        api<NamedImage[]>("categories/"),
        api<NamedImage[]>("brands/"),
    ]);
    return [
        ...["", "/categories", "/brands", "/news", "/contact"].map((path) => ({ url: `${SITE_URL}${path}` })),
        ...categories.map((c) => ({ url: `${SITE_URL}/categories/${c.slug}` })),
        ...brands.map((b) => ({ url: `${SITE_URL}/brands/${b.slug}` })),
        ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: p.updated_at })),
        ...news.map((n) => ({ url: `${SITE_URL}/news/${n.slug}` })),
    ];
}
