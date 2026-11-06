import type { Metadata } from "next";
import { Catalog, type SearchParams } from "@/components/catalog";
import { PageHead } from "@/components/section";
import { api } from "@/lib/api";
import type { NamedImage } from "@/lib/types";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

const getCategory = (slug: string) => api<NamedImage>(`categories/${encodeURIComponent(slug)}/`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = await getCategory((await params).slug);
    return {
        title: `${category.name} Margilonda`,
        description: `${category.name}: narx va brend bo'yicha tanlang. TECHVISION, Margilon.`,
        alternates: { canonical: `/categories/${category.slug}` },
    };
}

export default async function Page({ params, searchParams }: Props) {
    const category = await getCategory((await params).slug);
    return (
        <div className="wrap">
            <PageHead title={category.name} back={{ href: "/categories", label: "Katalog" }} />
            <Catalog searchParams={await searchParams} category={category.id} action={`/categories/${category.slug}`} />
        </div>
    );
}
