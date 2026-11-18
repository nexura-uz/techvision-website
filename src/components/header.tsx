import { Phone, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Category, type Settings, mediaUrl } from "@/lib/api";
import { formatPhone, telHref } from "@/lib/format";
import { CatalogMenu } from "./catalog-menu";
import { CategoryIcon } from "./category-icon";
import { MobileMenu } from "./mobile-menu";
import { SearchBox } from "./search-box";

const PAGES = [
  { href: "/service", label: "Servis" },
  { href: "/news", label: "Yangiliklar" },
  { href: "/contact", label: "Aloqa" },
];

// dark, like the logo's own background: the logo sits on it without a box
export function Header({ settings, categories, cartCount }: { settings: Settings; categories: Category[]; cartCount: number }) {
  const tops = categories.filter((c) => c.parent_id === null);
  const images = Object.fromEntries(categories.filter((c) => c.image).map((c) => [c.id, mediaUrl(c.image!)]));
  return (
    <>
      <header className="sticky top-0 z-30 bg-ink text-white [&_:focus-visible]:outline-teal">
        <div className="wrap flex h-14 items-center gap-3 lg:h-[4.5rem] lg:gap-5">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 text-lg font-bold tracking-tight">
            <Image src="/logo.png" alt="" width={34} height={34} priority unoptimized />
            <span className="display text-base tracking-wide lg:text-lg">TECHVISION</span>
          </Link>
          <div className="hidden lg:block"><CatalogMenu categories={categories} imageUrl={images} /></div>
          <SearchBox categories={categories} className="hidden max-w-3xl flex-1 lg:flex" />
          <div className="ml-auto flex items-center gap-1">
            {settings.phone && (
              <a href={telHref(settings.phone)} className="hidden min-h-11 flex-col justify-center px-3 leading-tight whitespace-nowrap xl:flex">
                <span className="text-xs text-white/60">Qo'ng'iroq qiling</span>
                <span className="flex items-center gap-1.5 font-semibold"><Phone className="size-3.5 text-teal" aria-hidden />{formatPhone(settings.phone)}</span>
              </a>
            )}
            <Link href="/cart" aria-label={cartCount ? `Savat, ${cartCount} ta mahsulot` : "Savat"} className="relative flex size-11 items-center justify-center rounded-lg hover:bg-white/10">
              <ShoppingCart className="size-6" aria-hidden />
              {cartCount > 0 && <span aria-hidden className="absolute top-0.5 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal px-1 text-xs font-bold text-ink">{cartCount > 99 ? "99+" : cartCount}</span>}
            </Link>
            <div className="lg:hidden"><MobileMenu categories={categories} settings={settings} /></div>
          </div>
        </div>
        <div className="wrap pb-3 lg:hidden"><SearchBox categories={categories} className="w-full" /></div>
      </header>
      {/* desktop: every top category one click away, plus the shop's own pages; scrolls with the page */}
      <nav aria-label="Bo'limlar" className="hidden border-b border-white/10 bg-ink-soft text-sm text-white/80 lg:block">
        <div className="wrap flex h-11 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {tops.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="flex h-8 flex-none items-center gap-2 rounded-md px-3 whitespace-nowrap hover:bg-white/10 hover:text-white">
              <CategoryIcon slug={c.slug} className="size-4 text-teal" /> {c.name}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px flex-none bg-white/15" aria-hidden />
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="flex h-8 flex-none items-center rounded-md px-3 font-medium whitespace-nowrap text-white hover:bg-white/10">{p.label}</Link>
          ))}
        </div>
      </nav>
    </>
  );
}
