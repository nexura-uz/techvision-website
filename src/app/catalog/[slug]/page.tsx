import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Catalog, type SearchParams, type Sections } from "@/components/catalog";
import { getCategories } from "@/lib/api";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

async function find(slug: string) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug) ?? notFound();
  const parent = categories.find((c) => c.id === category.parent_id);
  const subcategories = categories.filter((c) => c.parent_id === category.id);
  // a top category lists its subcategories; a subcategory lists its siblings, with the way back to its parent
  const sections: Sections = parent
    ? { back: { href: "/catalog", label: "Katalog" }, all: { href: `/catalog/${parent.slug}`, count: parent.products }, items: categories.filter((c) => c.parent_id === parent.id), active: category.slug }
    : { back: { href: "/catalog", label: "Katalog" }, all: { href: `/catalog/${category.slug}`, count: category.products }, items: subcategories, active: "" };
  return { category, parent, sections };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await find((await params).slug);
  return {
    title: `${category.name}: narxlar`,
    description: `${category.name} Marg'ilonda: ${category.products} ta mahsulot, narxlar so'mda. TECHVISION.`,
    alternates: { canonical: `/catalog/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category, parent, sections } = await find((await params).slug);
  const path = `/catalog/${category.slug}`;
  return (
    <div className="wrap">
      <Breadcrumbs items={[
        { href: "/", label: "Bosh sahifa" }, { href: "/catalog", label: "Katalog" },
        ...(parent ? [{ href: `/catalog/${parent.slug}`, label: parent.name }] : []), { href: path, label: category.name },
      ]} />
      <h1 className="mb-5 text-2xl lg:text-[2rem]">{category.name} <span className="font-sans text-base font-normal text-muted lg:text-lg">{category.products} ta</span></h1>
      <Catalog searchParams={await searchParams} category={category} sections={sections} path={path} />
    </div>
  );
}
