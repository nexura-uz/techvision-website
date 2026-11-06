import type { Metadata } from "next";
import { Catalog, type SearchParams } from "@/components/catalog";
import { CategoryList, PageHead } from "@/components/section";
import { api } from "@/lib/api";
import type { NamedImage } from "@/lib/types";

const TITLES: Record<string, string> = { new: "Yangi mahsulotlar", top: "Top mahsulotlar", sale: "Chegirmalar" };

export const metadata: Metadata = {
    title: "Katalog",
    description: "Noutbuk, kompyuter, monoblok, monitor, printer va kuzatuv kameralari. Narx va brend bo'yicha tanlang.",
    alternates: { canonical: "/categories" },
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const type = typeof params.type === "string" ? params.type : "";
    const categories = type ? [] : await api<NamedImage[]>("categories/");
    return (
        <div className="wrap">
            <PageHead title={TITLES[type] ?? "Katalog"} />
            {categories.length > 0 && <div className="mb-6"><CategoryList categories={categories} /></div>}
            <Catalog searchParams={params} action="/categories" />
        </div>
    );
}
