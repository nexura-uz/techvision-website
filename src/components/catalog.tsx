import { SlidersHorizontalIcon } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { Pagination } from "@/components/section";
import { api, API_URL, getSettings } from "@/lib/api";
import type { NamedImage, Paged, Product } from "@/lib/types";

export type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 20;
const SORTS = [
    { value: "-updated_at", label: "Avval yangilari" },
    { value: "final_price", label: "Avval arzonlari" },
    { value: "-final_price", label: "Avval qimmatlari" },
    { value: "name", label: "Nomi bo'yicha" },
];
const TYPES: Record<string, string> = { new: "is_new", top: "is_featured", sale: "on_sale" };

const list = (value: string | string[] | undefined) => (Array.isArray(value) ? value : value ? [value] : []);
const first = (value: string | string[] | undefined) => list(value)[0];

/** A mistyped filter or a page past the end shows an empty shelf, not the error page. */
async function fetchProducts(query: URLSearchParams): Promise<Paged<Product>> {
    const response = await fetch(`${API_URL}/api/products/?${query}`, { cache: "no-store" });
    if (response.status === 400 || response.status === 404) return { count: 0, next: null, previous: null, results: [] };
    if (!response.ok) throw new Error(`API products responded ${response.status}`);
    return response.json();
}

export async function Catalog({ searchParams, category, brand, action }: {
    searchParams: SearchParams;
    category?: number;
    brand?: number;
    action: string;
}) {
    const search = first(searchParams.search);
    const type = first(searchParams.type);
    const pickedBrands = list(searchParams.brand);
    const priceMin = first(searchParams.price_min);
    const priceMax = first(searchParams.price_max);
    const inStock = first(searchParams.in_stock) === "1";
    const sort = SORTS.some((s) => s.value === first(searchParams.ordering)) ? first(searchParams.ordering)! : SORTS[0].value;
    const page = Math.max(Number(first(searchParams.page)) || 1, 1);

    // Only these visitor-supplied values reach the API.
    const query = new URLSearchParams({ ordering: sort, page: String(page), page_size: String(PAGE_SIZE) });
    if (category) query.set("category", String(category));
    if (brand) query.set("brand", String(brand));
    else if (pickedBrands.length) query.set("brand", pickedBrands.join(","));
    if (search) query.set("search", search);
    if (type && TYPES[type]) query.set(TYPES[type], "true");
    if (inStock) query.set("is_in_stock", "true");

    const [settings, brands] = await Promise.all([getSettings(), brand ? [] : api<NamedImage[]>("brands/")]);
    // Customers think in so'm; the API filters on the stored USD price.
    const toUsd = (price: string) => (settings.usd_rate ? (Number(price) / Number(settings.usd_rate)).toFixed(2) : price);
    if (priceMin) query.set("price_min", toUsd(priceMin));
    if (priceMax) query.set("price_max", toUsd(priceMax));
    const products = await fetchProducts(query);

    const pageHref = (n: number) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
            if (key !== "page") list(value).forEach((v) => params.append(key, v));
        }
        params.set("page", String(n));
        return `${action}?${params}`;
    };
    const activeFilters = pickedBrands.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) + (inStock ? 1 : 0);
    const clearParams = new URLSearchParams();
    if (search) clearParams.set("search", search);
    if (type) clearParams.set("type", type);

    return (
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
            <details open={activeFilters > 0 || undefined} className="mb-4 border border-line" data-filters>
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center gap-2 font-medium [&::-webkit-details-marker]:hidden">
                    <SlidersHorizontalIcon size={18} aria-hidden /> Filtr va saralash{activeFilters > 0 && ` (${activeFilters})`}
                </summary>
                <Form action={action} className="flex flex-col gap-5 border-t border-line p-4">
                    {search && <input type="hidden" name="search" value={search} />}
                    {type && <input type="hidden" name="type" value={type} />}

                    <label className="block font-medium">
                        Saralash
                        <select name="ordering" defaultValue={sort} className="field mt-1 font-normal">
                            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </label>

                    <fieldset>
                        <legend className="font-medium">Narx, {settings.usd_rate ? "so'm" : "USD"}</legend>
                        <div className="mt-1 flex gap-2">
                            <input name="price_min" type="number" inputMode="numeric" min="0" defaultValue={priceMin} aria-label="Eng past narx" placeholder="dan" className="field" />
                            <input name="price_max" type="number" inputMode="numeric" min="0" defaultValue={priceMax} aria-label="Eng yuqori narx" placeholder="gacha" className="field" />
                        </div>
                    </fieldset>

                    {brands.length > 0 && (
                        <fieldset>
                            <legend className="font-medium">Brend</legend>
                            <div className="mt-1 grid grid-cols-2 lg:grid-cols-1">
                                {brands.map((b) => (
                                    <label key={b.id} className="flex min-h-11 cursor-pointer items-center gap-2">
                                        <input type="checkbox" name="brand" value={b.id} defaultChecked={pickedBrands.includes(String(b.id))} className="size-5 accent-teal-deep" />
                                        {b.name}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    <label className="flex min-h-11 cursor-pointer items-center gap-2 font-medium">
                        <input type="checkbox" name="in_stock" value="1" defaultChecked={inStock} className="size-5 accent-teal-deep" />
                        Faqat sotuvdagilari
                    </label>

                    <button className="btn btn-primary !w-full">Natijani ko'rsatish</button>
                    {activeFilters > 0 && <Link href={`${action}${clearParams.size ? `?${clearParams}` : ""}`} className="link flex min-h-11 items-center justify-center">Filtrlarni tozalash</Link>}
                </Form>
            </details>

            <div>
                <p className="mb-3 text-muted">{products.count} ta mahsulot</p>
                {products.results.length > 0 ? (
                    <ProductGrid products={products.results} usdRate={settings.usd_rate} />
                ) : (
                    <p className="bg-paper p-6">Bu shartlarga mos mahsulot yo'q. Filtrlarni kamaytirib ko'ring yoki <Link href="/contact" className="link">bizga yozing</Link>.</p>
                )}
                <Pagination page={page} totalPages={Math.ceil(products.count / PAGE_SIZE)} href={pageHref} />
            </div>
        </div>
    );
}
