import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { type Category, getBrands, getProducts } from "@/lib/api";
import { som } from "@/lib/format";
import { AutoSubmit } from "./auto-submit";
import { FilterSheet } from "./filter-sheet";
import { ProductGrid } from "./product-card";
import { SortSelect } from "./sort-select";

export type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 24;
const SORTS = [
  ["new", "Avval yangilari"],
  ["cheap", "Avval arzonlari"],
  ["expensive", "Avval qimmatlari"],
  ["name", "Nomi bo'yicha"],
] as const;

const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const one = (v: string | string[] | undefined) => all(v)[0] ?? "";
const digits = (v: string) => v.replace(/\D/g, ""); // "5 000 000" → "5000000"

// page numbers around the current one: 1 … 4 5 6 … 12
function pageNumbers(page: number, total: number): (number | null)[] {
  const near = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const out: (number | null)[] = [];
  [...near].sort((a, b) => a - b).forEach((n, i, list) => {
    if (i > 0 && n - list[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

/** The product list with its filters. Filters are a plain GET form: they work without JavaScript and every
 *  filtered view has its own address that can be shared. `path` is the page the form submits to. */
/** The sidebar's "Bo'lim" list: where the visitor is, its neighbours, the way back. */
export type Sections = { back?: { href: string; label: string }; all?: { href: string; count: number }; items: Category[]; active?: string };

export async function Catalog({ searchParams, category, sections, path }: {
  searchParams: SearchParams
  category?: Category
  sections: Sections
  path: string
}) {
  const q = one(searchParams.q).trim();
  const brands = all(searchParams.brand).flatMap((b) => b.split(",")).filter(Boolean);
  const priceMin = digits(one(searchParams.price_min));
  const priceMax = digits(one(searchParams.price_max));
  const inStock = one(searchParams.in_stock) === "1";
  const sort = SORTS.some(([key]) => key === one(searchParams.sort)) ? one(searchParams.sort) : "new";
  const page = Math.max(Number(one(searchParams.page)) || 1, 1);

  // only these visitor-supplied values reach the API
  const query = new URLSearchParams({ sort, page: String(page), page_size: String(PAGE_SIZE) });
  if (category) query.set("category", category.slug);
  if (brands.length) query.set("brand", brands.join(","));
  if (q) query.set("q", q);
  if (priceMin) query.set("price_min", priceMin);
  if (priceMax) query.set("price_max", priceMax);
  if (inStock) query.set("in_stock", "true");
  const [list, brandList] = await Promise.all([getProducts(query.toString()), getBrands(category?.slug)]);
  const shownBrands = brandList.filter((b) => b.products > 0 || brands.includes(b.slug));

  // the current address without one value (for the chips' ×) or with another page
  const href = (drop: { key: string; value?: string } | null, page?: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page") continue;
      all(value).flatMap((v) => (key === "brand" ? v.split(",") : [v])).forEach((v) => {
        if (!(drop && drop.key === key && (drop.value === undefined || drop.value === v))) params.append(key, v);
      });
    }
    if (page && page > 1) params.set("page", String(page));
    return params.size ? `${path}?${params}` : path;
  };
  const chips = [
    ...(q ? [{ label: `«${q}»`, href: href({ key: "q" }) }] : []),
    ...brands.map((b) => ({ label: brandList.find((x) => x.slug === b)?.name ?? b, href: href({ key: "brand", value: b }) })),
    ...(priceMin ? [{ label: `${som(Number(priceMin))} dan`, href: href({ key: "price_min" }) }] : []),
    ...(priceMax ? [{ label: `${som(Number(priceMax))} gacha`, href: href({ key: "price_max" }) }] : []),
    ...(inStock ? [{ label: "Sotuvda bor", href: href({ key: "in_stock" }) }] : []),
  ];
  // another section keeps the visitor's brands, price and stock choices
  const keep = (target: string) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) if (key !== "page") all(value).forEach((v) => params.append(key, v));
    return params.size ? `${target}?${params}` : target;
  };
  const sectionLinks = [
    ...(sections.all ? [{ href: sections.all.href, label: "Hammasi", count: sections.all.count, active: !sections.active || sections.active === "" }] : []),
    ...sections.items.map((c) => ({ href: `/catalog/${c.slug}`, label: c.name, count: c.products, active: c.slug === sections.active })),
  ];
  const totalPages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const active = chips.length - (q ? 1 : 0);
  const clear = q ? `${path}?q=${encodeURIComponent(q)}` : path;

  return (
    <>
      {/* phones: the sections as a row of pills (the sidebar is behind the "Filtr" button there) */}
      {sectionLinks.length > 1 && (
        <ul className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:hidden">
          {sections.back && <li className="flex-none"><Link href={keep(sections.back.href)} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line px-3 text-sm font-medium"><ChevronLeft className="size-4" aria-hidden />{sections.back.label}</Link></li>}
          {sectionLinks.map((l) => (
            <li key={l.href} className="flex-none">
              <Link href={keep(l.href)} aria-current={l.active ? "page" : undefined}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap ${l.active ? "bg-ink text-white" : "bg-stage"}`}>
                {l.label} <span className={l.active ? "text-white/60" : "text-muted"}>{l.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
        <aside className="mb-4 lg:mb-0 lg:self-start">
          <FilterSheet active={active}>
            <Form action={path} scroll={false} className="grid">
              <AutoSubmit />
              {q && <input type="hidden" name="q" value={q} />}
              {(sectionLinks.length > 1 || sections.back) && (
                <nav aria-label="Bo'limlar" className="hidden border-b border-line py-5 first:pt-0 lg:block">
                  <p className="mb-2 text-sm font-bold">Bo'lim</p>
                  {sections.back && (
                    <Link href={keep(sections.back.href)} className="mb-1 flex min-h-9 items-center gap-1 rounded-md px-1 text-sm text-muted hover:text-ink">
                      <ChevronLeft className="size-4" aria-hidden /> {sections.back.label}
                    </Link>
                  )}
                  <ul className="grid">
                    {sectionLinks.map((l) => (
                      <li key={l.href}>
                        <Link href={keep(l.href)} aria-current={l.active ? "page" : undefined}
                          className={`flex min-h-9 items-center justify-between gap-2 rounded-md px-2.5 text-sm ${l.active ? "bg-ink font-semibold text-white" : "hover:bg-stage"}`}>
                          {l.label} <span className={`text-xs ${l.active ? "text-white/60" : "text-muted"}`}>{l.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              {sort !== "new" && <input type="hidden" name="sort" value={sort} />}
              <fieldset className="border-b border-line py-5 first:pt-0">
                <legend className="float-left mb-2.5 w-full text-sm font-bold">Narx, so'm</legend>
                <div className="clear-both flex gap-2">
                  <input name="price_min" inputMode="numeric" defaultValue={priceMin} placeholder="dan" aria-label="Eng past narx" className="field" />
                  <input name="price_max" inputMode="numeric" defaultValue={priceMax} placeholder="gacha" aria-label="Eng yuqori narx" className="field" />
                </div>
              </fieldset>
              {shownBrands.length > 0 && (
                <fieldset className="border-b border-line py-5 first:pt-0">
                  <legend className="float-left mb-2.5 w-full text-sm font-bold">Brend</legend>
                  <div className="clear-both grid max-h-80 overflow-y-auto">
                    {shownBrands.map((b) => (
                      <label key={b.id} className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-md text-sm hover:bg-stage lg:px-1">
                        <input type="checkbox" name="brand" value={b.slug} defaultChecked={brands.includes(b.slug)} className="size-[1.125rem] accent-teal-deep" />
                        <span className="flex-1">{b.name}</span>
                        <span className="text-xs text-muted">{b.products}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <fieldset className="border-b border-line py-5 first:pt-0">
                <legend className="float-left mb-2.5 w-full text-sm font-bold">Mavjudligi</legend>
                <label className="clear-both flex min-h-10 cursor-pointer items-center gap-2.5 text-sm">
                  <input type="checkbox" name="in_stock" value="1" defaultChecked={inStock} className="size-[1.125rem] accent-teal-deep" />
                  Faqat sotuvda borlari
                </label>
              </fieldset>
              <div className="sticky bottom-0 -mx-4 grid gap-2 border-t border-line bg-white p-4 lg:static lg:mx-0 lg:border-0 lg:p-0 lg:pt-5">
                <button className="btn btn-primary w-full">Natijani ko'rsatish</button>
                {active > 0 && <Link href={clear} className="btn w-full text-sm text-teal-deep hover:underline">Filtrlarni tozalash</Link>}
              </div>
            </Form>
          </FilterSheet>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted"><b className="text-ink">{list.total}</b> ta mahsulot</p>
            <SortSelect options={SORTS} value={sort} />
          </div>
          {chips.length > 0 && (
            <ul className="mb-4 flex flex-wrap items-center gap-2" aria-label="Tanlangan filtrlar">
              {chips.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} aria-label={`Olib tashlash: ${c.label}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-stage pr-2.5 pl-3.5 text-sm font-medium hover:bg-line">
                    {c.label} <X className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
              {active > 1 && <li><Link href={clear} className="px-2 text-sm font-semibold text-teal-deep hover:underline">Hammasini tozalash</Link></li>}
            </ul>
          )}

          <h2 className="sr-only">Mahsulotlar</h2>
          {list.items.length > 0 ? (
            <div data-results><ProductGrid products={list.items} narrow /></div>
          ) : (
            <div className="rounded-xl bg-stage p-10 text-center">
              <p className="display text-lg">Bu shartlarga mos mahsulot topilmadi</p>
              <p className="mt-2 text-muted">Filtrlarni kamaytiring yoki bizga yozing: kerakli mahsulotni topib beramiz.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {active > 0 && <Link href={clear} className="btn btn-primary">Filtrlarni tozalash</Link>}
                <Link href="/contact" className="btn btn-outline">Bog'lanish</Link>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Sahifalar" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
              {page > 1 && <Link href={href(null, page - 1)} aria-label="Oldingi sahifa" className="btn btn-outline size-11 p-0"><ChevronLeft className="size-5" /></Link>}
              {pageNumbers(page, totalPages).map((n, i) => n === null
                ? <span key={`gap${i}`} className="px-1 text-muted">…</span>
                : <Link key={n} href={href(null, n)} aria-current={n === page ? "page" : undefined}
                    className={`btn size-11 p-0 ${n === page ? "bg-ink text-white" : "btn-outline"}`}>{n}</Link>)}
              {page < totalPages && <Link href={href(null, page + 1)} aria-label="Keyingi sahifa" className="btn btn-outline size-11 p-0"><ChevronRight className="size-5" /></Link>}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
