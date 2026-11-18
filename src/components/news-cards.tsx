import { Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type NewsCard, mediaUrl } from "@/lib/api";
import { date } from "@/lib/format";

export function NewsCards({ news, className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" }: { news: NewsCard[]; className?: string }) {
  return (
    <ul className={className}>
      {news.map((n) => (
        <li key={n.id}>
          <Link href={`/news/${n.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-ink/30">
            <span className="relative flex aspect-[16/9] items-center justify-center bg-paper">
              {n.image ? <Image src={mediaUrl(n.image)} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" className="object-cover" /> : <Newspaper className="size-8 text-muted" aria-hidden />}
            </span>
            <span className="p-4">
              <time dateTime={n.created_at} className="text-sm text-muted">{date(n.created_at)}</time>
              <span className="mt-1 block leading-6 font-semibold group-hover:underline">{n.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
