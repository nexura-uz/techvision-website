import type { MetadataRoute } from "next";
import { SITE_URL, getCategories, getNews, getPages, getProducts, getServices } from "@/lib/api";

// every page Google should know: the main pages, every category, every visible product, news and info pages
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, news, pages, services] = await Promise.all([getCategories(), getNews(), getPages(), getServices()]);
  const slugs: string[] = [];
  for (let page = 1; ; page++) {
    const list = await getProducts(`page=${page}&page_size=60&sort=name`);
    slugs.push(...list.items.map((p) => p.slug));
    if (page * 60 >= list.total) break;
  }
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/catalog`, priority: 0.9 },
    { url: `${SITE_URL}/service`, priority: 0.7 },
    { url: `${SITE_URL}/contact`, priority: 0.7 },
    ...services.map((g) => ({ url: `${SITE_URL}/service/${g.slug}`, priority: 0.7 })),
    { url: `${SITE_URL}/news`, priority: 0.5 },
    ...news.map((n) => ({ url: `${SITE_URL}/news/${n.slug}`, lastModified: n.created_at, priority: 0.4 })),
    ...pages.map((p) => ({ url: `${SITE_URL}/pages/${p.slug}`, priority: 0.3 })),
    ...categories.filter((c) => c.products > 0).map((c) => ({ url: `${SITE_URL}/catalog/${c.slug}`, priority: 0.8 })),
    ...slugs.map((slug) => ({ url: `${SITE_URL}/product/${slug}`, priority: 0.6 })),
  ];
}
