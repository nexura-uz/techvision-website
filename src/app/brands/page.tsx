import type { Metadata } from "next";
import { CategoryList, PageHead } from "@/components/section";
import { api } from "@/lib/api";
import type { NamedImage } from "@/lib/types";

export const metadata: Metadata = {
    title: "Brendlar",
    description: "TECHVISION do'konidagi brendlar.",
    alternates: { canonical: "/brands" },
};

export default async function Page() {
    const brands = await api<NamedImage[]>("brands/");
    return (
        <div className="wrap">
            <PageHead title="Brendlar" />
            {brands.length > 0 ? <CategoryList categories={brands} base="/brands" /> : <p className="bg-paper p-6">Hozircha brendlar qo'shilmagan.</p>}
        </div>
    );
}
