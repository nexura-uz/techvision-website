import type { Metadata } from "next";
import Image from "next/image";
import { PageHead } from "@/components/section";
import { api } from "@/lib/api";
import { formatDate, jsonLd } from "@/lib/site";
import type { News } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

const getNews = (slug: string) => api<News>(`news/${encodeURIComponent(slug)}/`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const news = await getNews((await params).slug);
    return {
        title: news.title,
        description: news.content.slice(0, 160),
        alternates: { canonical: `/news/${news.slug}` },
        openGraph: { title: news.title, type: "article", images: [news.image] },
    };
}

export default async function Page({ params }: Props) {
    const news = await getNews((await params).slug);
    const schema = { "@context": "https://schema.org", "@type": "NewsArticle", headline: news.title, image: [news.image], datePublished: news.created_at };
    return (
        <article className="wrap max-w-3xl">
            <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
            <PageHead title={news.title} back={{ href: "/news", label: "Yangiliklar" }} />
            <time dateTime={news.created_at} className="block text-muted">{formatDate(news.created_at)}</time>
            <div className="relative mt-4 aspect-video bg-paper">
                <Image src={news.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
            <p className="mt-5 text-lg leading-8 whitespace-pre-wrap">{news.content}</p>
        </article>
    );
}
