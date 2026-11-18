import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Text } from "@/components/text";
import { getNewsItem, mediaUrl } from "@/lib/api";
import { date } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsItem((await params).slug);
  return {
    title: news.title,
    description: news.content.slice(0, 160),
    alternates: { canonical: `/news/${news.slug}` },
    openGraph: { type: "article", images: news.image ? [mediaUrl(news.image)] : undefined },
  };
}

export default async function NewsItemPage({ params }: Props) {
  const news = await getNewsItem((await params).slug);
  return (
    <article className="wrap">
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/news", label: "Yangiliklar" }, { href: `/news/${news.slug}`, label: news.title }]} />
      <time dateTime={news.created_at} className="text-sm text-muted">{date(news.created_at)}</time>
      <h1 className="mt-1 max-w-3xl text-2xl font-bold tracking-tight lg:text-3xl">{news.title}</h1>
      {news.image && (
        <div className="relative mt-6 aspect-[16/9] max-w-3xl overflow-hidden rounded-lg bg-paper">
          <Image src={mediaUrl(news.image)} alt="" fill priority sizes="(min-width: 800px) 768px, 100vw" className="object-cover" />
        </div>
      )}
      <div className="mt-6"><Text>{news.content}</Text></div>
    </article>
  );
}
