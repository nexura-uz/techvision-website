import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Form from "next/form";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { NAV } from "@/components/nav-links";
import { getCart } from "@/lib/cart";
import type { SiteSettings } from "@/lib/types";

function SearchForm({ className }: { className: string }) {
    return (
        <Form action="/search" role="search" className={`flex ${className}`}>
            <input name="search" type="search" required enterKeyHint="search" aria-label="Mahsulot qidirish" placeholder="Noutbuk, kamera, printer..." className="field rounded-r-none" />
            <button className="btn btn-ink !w-12 shrink-0 rounded-l-none !px-0" aria-label="Qidirish"><SearchIcon size={20} aria-hidden /></button>
        </Form>
    );
}

export async function Header({ settings }: { settings: SiteSettings }) {
    const count = Object.values(await getCart()).reduce((sum, quantity) => sum + quantity, 0);
    return (
        <>
            <header className="fixed inset-x-0 top-0 z-20 border-b border-line bg-white">
                <div className="wrap flex h-14 items-center gap-6 lg:h-[4.5rem]">
                    <Link href="/" className="flex min-h-11 items-center gap-2 text-xl tracking-tight">
                        <Image src="/logo.png" alt="" width={32} height={32} priority />
                        TECHVISION
                    </Link>
                    <nav aria-label="Asosiy menyu" className="hidden gap-6 lg:flex">
                        {NAV.map((item) => (
                            <Link key={item.href} href={item.href} className="decoration-1 underline-offset-4 hover:underline">{item.label}</Link>
                        ))}
                    </nav>
                    <SearchForm className="hidden flex-1 lg:flex" />
                    <div className="ml-auto flex items-center lg:ml-0">
                        <Link href="/cart" aria-label={count ? `Savat, ${count} ta mahsulot` : "Savat"} className="relative flex size-11 items-center justify-center">
                            <ShoppingCartIcon size={24} aria-hidden />
                            {count > 0 && <span aria-hidden className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-deep px-1 text-xs font-medium text-white">{count > 99 ? "99+" : count}</span>}
                        </Link>
                        <MobileMenu settings={settings} />
                    </div>
                </div>
            </header>
            <div className="h-14 lg:h-[4.5rem]" aria-hidden />
            <div className="wrap py-3 lg:hidden"><SearchForm className="w-full" /></div>
        </>
    );
}
