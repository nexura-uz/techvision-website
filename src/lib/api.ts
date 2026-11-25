import { notFound } from "next/navigation";

// read on the server only: the browser never talks to the API directly
export const API_URL = process.env.API_URL ?? "http://localhost:8000";
export const SITE_URL = process.env.SITE_URL ?? "https://tech-vision.uz";

/** GET from the API. Answers are cached for a minute, so pages are fast; the API calls /api/revalidate after every admin
 *  change, so edits show on the next visit (within 60 s if that call fails).
 *  An API 404 becomes the site's 404 page. */
export async function api<T>(path: string): Promise<T> {
  const response = await fetch(API_URL + path, { next: { revalidate: 60, tags: ["api"] } });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`API ${path} answered ${response.status}`);
  return response.json();
}

/** Files from the admin's media library are on the API; Icecat links are used as they are. */
export const mediaUrl = (url: string) => (url.startsWith("/media/") ? API_URL + url : url);

export type Settings = Partial<Record<"phone" | "instagram_url" | "telegram_url" | "telegram_channel_url" | "youtube_url", string>>;

export type Category = { id: number; name: string; slug: string; image: string | null; parent_id: number | null; products: number };
export type Brand = { id: number; name: string; slug: string; logo: string | null; products: number };
export type Store = {
  id: number; name: string; address: string; region: string | null; latitude: string | null; longitude: string | null;
  phone: string; phone_2: string; working_hours: string; image: string | null;
};
export type StockStatus = "in_stock" | "to_order" | "on_the_way" | "none";
export type ProductCard = {
  id: number; name: string; slug: string; brand: string | null; category?: string | null; image: string | null; images: string[]; specs: string[];
  price_som: number | null; old_price_som: number | null; stock_status: StockStatus; is_new: boolean; is_featured: boolean;
};

export const getSettings = () => api<Settings>("/settings");
// empty categories (the tree is ready before the stock is) are left out everywhere on the site, their pages too
export const getCategories = async () => (await api<Category[]>("/categories")).filter((c) => c.products > 0);
export const getStores = () => api<Store[]>("/stores");

export type ProductList = { total: number; page: number; page_size: number; items: ProductCard[] };

// `category`: product counts within that category (the catalog filter lists only the brands it has)
export const getBrands = (category?: string) => api<Brand[]>(category ? `/brands?category=${encodeURIComponent(category)}` : "/brands");
export const getProducts = (query: string) => api<ProductList>(`/products?${query}`);

export type Product = {
  id: number; name: string; slug: string; short_description: string; description: string;
  brand: { name: string; slug: string; logo: string | null } | null;
  category: { name: string; slug: string } | null;
  parent_category: { name: string; slug: string } | null;
  price_som: number | null; old_price_som: number | null; stock_status: StockStatus; price_changed_at: string;
  warranty: string; video_url: string; mpn: string | null; images: string[];
  specs: { name: string; value: string }[]; updated_at: string; similar: ProductCard[];
};

export const getProduct = (slug: string) => api<Product>(`/products/${encodeURIComponent(slug)}`);

export type Banner = { id: number; image: string; link: string };
export type Faq = { id: number; question: string; answer: string };
export type NewsCard = { id: number; title: string; slug: string; image: string | null; created_at: string };
export type News = NewsCard & { content: string };
export type Page = { slug: string; title: string; content: string; updated_at: string };

export const getBanners = () => api<Banner[]>("/banners");
export const getFaqs = () => api<Faq[]>("/faqs");
export const getNews = () => api<NewsCard[]>("/news");
export const getNewsItem = (slug: string) => api<News>(`/news/${encodeURIComponent(slug)}`);
export const getPages = () => api<{ slug: string; title: string }[]>("/pages"); // only pages that have text
export const getPage = (slug: string) => api<Page>(`/pages/${encodeURIComponent(slug)}`);

export type ServiceGroup = {
  id: number; name: string; slug: string; icon: string; summary: string; description: string; image: string | null;
  services: { id: number; name: string; note: string; warranty: string }[];
};
export const getServices = () => api<ServiceGroup[]>("/services");
export const getServiceGroup = (slug: string) => api<ServiceGroup>(`/services/${encodeURIComponent(slug)}`);
