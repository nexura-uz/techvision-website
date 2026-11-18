import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { type ReactNode, Suspense } from "react";
import { ActionBar } from "@/components/action-bar";
import { CartToast } from "@/components/cart-toast";
import { NavProgress } from "@/components/nav-progress";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SITE_URL, getCategories, getPages, getSettings } from "@/lib/api";
import { cartCount, readCart } from "@/lib/cart";

// kept in the repo, so a build never depends on reaching Google Fonts
const inter = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", display: "swap", variable: "--font-inter" });
const unbounded = localFont({ src: "./fonts/unbounded-latin.woff2", weight: "200 900", display: "swap", variable: "--font-unbounded" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TECHVISION: kompyuter do'koni va servis markazi", template: "%s | TECHVISION" },
  description: "Noutbuk, kompyuter, monitor, printer va kuzatuv kameralari. Ta'mirlash va kamera o'rnatish.",
  openGraph: { siteName: "TECHVISION", locale: "uz_UZ", type: "website" },
};

// matches the dark header, so the phone's status bar blends into it
export const viewport: Viewport = { themeColor: "#141414", viewportFit: "cover" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, categories, pages, cart] = await Promise.all([getSettings(), getCategories(), getPages(), readCart()]);
  return (
    <html lang="uz" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        {/* keyboard users: the first Tab shows this, so they can skip the header's menus */}
        <a href="#main" className="sr-only z-[80] rounded-lg bg-teal px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Asosiy qismga o'tish</a>
        <Suspense><NavProgress /></Suspense>
        <Header settings={settings} categories={categories} cartCount={cartCount(cart)} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
        <Footer settings={settings} pages={pages} />
        <ActionBar settings={settings} />
        <CartToast />
      </body>
    </html>
  );
}
