import type { Metadata } from "next";
import { NewsList, PageHead, Pagination } from "@/components/section";
import { API_URL } from "@/lib/api";
import type { News, Paged } from "@/lib/types";

const PAGE_SIZE = 20;

export const metadata: Metadata = { title: "Yangiliklar", description: "TECHVISION do'koni va servis markazi yangiliklari.", alternates: { canonical: "/news" } };

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const page = Math.max(Number((await searchParams).page) || 1, 1);
    const response = await fetch(`${API_URL}/api/news/?page=${page}&page_size=${PAGE_SIZE}`, { cache: "no-store" });
    if (!response.ok && response.status !== 404) throw new Error(`API news responded ${response.status}`);
    const news: Paged<News> = response.ok ? await response.json() : { count: 0, next: null, previous: null, results: [] };
    return (
        <div className="wrap">
            <PageHead title="Yangiliklar" />
            {news.results.length > 0 ? <NewsList items={news.results} /> : <p className="bg-paper p-6">Hozircha yangilik yo'q.</p>}
            <Pagination page={page} totalPages={Math.ceil(news.count / PAGE_SIZE)} href={(n) => `/news?page=${n}`} />
        </div>
    );
}
