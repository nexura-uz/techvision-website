import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Catalog, type SearchParams } from "@/components/catalog";
import { getCategories } from "@/lib/api";

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return typeof q === "string" && q
    ? { title: `«${q}» bo'yicha qidiruv`, robots: { index: false } }
    : { title: "Katalog", description: "Noutbuk, monitor, printer, SSD va boshqa texnika: narxlar so'mda.", alternates: { canonical: "/catalog" } };
}

export default async function CatalogPage({ searchParams }: Props) {
  const [params, categories] = await Promise.all([searchParams, getCategories()]);
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const tops = categories.filter((c) => c.parent_id === null);
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ href: "/", label: "Bosh sahifa" }, { href: "/catalog", label: "Katalog" }]} />
      <h1 className="mb-5 text-2xl lg:text-[2rem]">{q ? `«${q}» bo'yicha natijalar` : "Katalog"}</h1>
      <Catalog searchParams={params} path="/catalog" sections={{ all: { href: "/catalog", count: tops.reduce((n, c) => n + c.products, 0) }, items: tops, active: "" }} />
    </div>
  );
}
