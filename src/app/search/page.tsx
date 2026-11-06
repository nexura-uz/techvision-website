import type { Metadata } from "next";
import { Catalog, type SearchParams } from "@/components/catalog";
import { PageHead } from "@/components/section";

export const metadata: Metadata = { title: "Qidiruv", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const term = typeof params.search === "string" ? params.search : "";
    return (
        <div className="wrap">
            <PageHead title={term ? `"${term}" bo'yicha natijalar` : "Qidiruv"} />
            <Catalog searchParams={params} action="/search" />
        </div>
    );
}
