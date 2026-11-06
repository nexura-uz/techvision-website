"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/components/nav-links";
import { formatPhone, telHref } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

/** Full-screen sheet with thumb-sized rows; any tap on a row or outside closes it. */
export function MobileMenu({ settings }: { settings: SiteSettings }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
                className="flex size-11 cursor-pointer items-center justify-center"
            >
                {open ? <XIcon size={24} aria-hidden /> : <MenuIcon size={24} aria-hidden />}
            </button>
            {open && (
                <div id="mobile-menu" onClick={() => setOpen(false)} className="fixed inset-x-0 top-14 bottom-0 flex flex-col overflow-y-auto bg-white">
                    <nav aria-label="Asosiy menyu" className="wrap">
                        {NAV.map((item) => (
                            <Link key={item.href} href={item.href} className="flex min-h-14 items-center border-b border-line text-lg font-medium active:bg-paper">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="wrap mt-auto pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                        {settings.phone && <a href={telHref(settings.phone)} className="flex min-h-11 items-center text-lg font-medium">{formatPhone(settings.phone)}</a>}
                        {settings.working_hours && <p className="text-muted">{settings.working_hours}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
