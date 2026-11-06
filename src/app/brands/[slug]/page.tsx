import type { Metadata } from "next";
import { Catalog, type SearchParams } from "@/components/catalog";
import { PageHead } from "@/components/section";
import { api } from "@/lib/api";
import type { NamedImage } from "@/lib/types";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

const getBrand = (slug: string) => api<NamedImage>(`brands/${encodeURIComponent(slug)}/`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const brand = await getBrand((await params).slug);
    return {
        title: brand.name,
        description: `${brand.name} mahsulotlari: narxlari va xususiyatlari. TECHVISION, Margilon.`,
        alternates: { canonical: `/brands/${brand.slug}` },
    };
}

export default async function Page({ params, searchParams }: Props) {
    const brand = await getBrand((await params).slug);
    return (
        <div className="wrap">
            <PageHead title={brand.name} back={{ href: "/brands", label: "Brendlar" }} />
            <Catalog searchParams={await searchParams} brand={brand.id} action={`/brands/${brand.slug}`} />
        </div>
    );
}
