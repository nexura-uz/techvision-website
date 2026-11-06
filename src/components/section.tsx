import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/site";
import type { NamedImage, News } from "@/lib/types";

export function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
    return (
        <section id={id} className="wrap mt-12 lg:mt-20">
            <h2 className="h2 mb-4 lg:mb-6">{title}</h2>
            {children}
        </section>
    );
}

export function PageHead({ title, back, children }: { title: string; back?: { href: string; label: string }; children?: ReactNode }) {
    return (
        <div className="mb-5 lg:mt-6 lg:mb-8">
            {back && <Link href={back.href} className="link inline-flex min-h-11 items-center">{back.label}</Link>}
            <h1 className="h1">{title}</h1>
            {children && <p className="mt-2 max-w-2xl text-lg leading-7 text-muted">{children}</p>}
        </div>
    );
}

export function CategoryList({ categories, base = "/categories" }: { categories: NamedImage[]; base?: string }) {
    return (
        <ul className="border-t border-line md:grid md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
            {categories.map((category) => (
                <li key={category.id} className="border-b border-line">
                    <Link href={`${base}/${category.slug}`} className="card flex min-h-16 items-center gap-3 py-2">
                        <span className="relative size-12 shrink-0 overflow-hidden">
                            <Image src={category.image} alt="" fill sizes="48px" className="object-contain" />
                        </span>
                        <span className="flex-1 font-medium">{category.name}</span>
                        <ChevronRightIcon size={20} aria-hidden className="text-muted" />
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export function NewsList({ items }: { items: News[] }) {
    return (
        <ul className="grid border-t border-line md:grid-cols-3 md:gap-6 md:border-t-0">
            {items.map((item) => (
                <li key={item.id} className="border-b border-line md:border-b-0">
                    <Link href={`/news/${item.slug}`} className="card flex items-center gap-3 py-3 md:block md:py-0">
                        <span className="relative block aspect-video w-28 shrink-0 overflow-hidden bg-paper md:w-full">
                            <Image src={item.image} alt="" fill sizes="(min-width: 768px) 33vw, 112px" className="object-cover" />
                        </span>
                        <span className="min-w-0 md:mt-3 md:block">
                            <time dateTime={item.created_at} className="block text-sm text-muted">{formatDate(item.created_at)}</time>
                            <span className="line-clamp-3 leading-6 font-medium">{item.title}</span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

/** Thumb-sized previous and next links; a row of page numbers does not fit a phone. */
export function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (page: number) => string }) {
    if (totalPages < 2) return null;
    return (
        <nav aria-label="Sahifalar" className="mt-6 flex items-center gap-3">
            {page > 1 ? <Link href={href(page - 1)} className="btn btn-secondary flex-1 md:flex-none">Oldingi</Link> : <span className="flex-1 md:flex-none" />}
            <span className="shrink-0 text-muted" aria-current="page">{page} / {totalPages}</span>
            {page < totalPages ? <Link href={href(page + 1)} className="btn btn-secondary flex-1 md:flex-none">Keyingi</Link> : <span className="flex-1 md:flex-none" />}
        </nav>
    );
}
