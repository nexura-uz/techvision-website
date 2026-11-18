import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsCards } from "@/components/news-cards";
import { getNews } from "@/lib/api";

export const metadata: Metadata = {
  title: "Yangiliklar",
  description: "TECHVISION yangiliklari: yangi mahsulotlar, do'konlar va bajarilgan ishlar.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const news = await getNews();
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/news", label: "Yangiliklar" }]} />
      <h1 className="mb-6 text-2xl font-bold tracking-tight lg:text-3xl">Yangiliklar</h1>
      {news.length > 0 ? <NewsCards news={news} /> : <p className="text-muted">Hozircha yangilik yo'q.</p>}
    </div>
  );
}
