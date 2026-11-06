import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Work_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ActionBar } from "@/components/action-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { api, getSettings, getSocialLinks } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import type { Contact } from "@/lib/types";

const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-work-sans" });

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "TECHVISION", template: "%s | TECHVISION" },
    openGraph: { siteName: "TECHVISION", locale: "uz_UZ", type: "website" },
    other: { "page-type": "place", "site-kind": "other", "page-kind": "place" },
};

export const viewport: Viewport = { themeColor: "#ffffff", viewportFit: "cover" };

export default async function RootLayout({ children }: { children: ReactNode }) {
    const [settings, socials, contacts] = await Promise.all([getSettings(), getSocialLinks(), api<Contact[]>("contacts/")]);
    return (
        <html lang="uz" data-type="place" className={workSans.variable}>
            <body className="flex min-h-dvh flex-col font-sans">
                <Header settings={settings} />
                <main className="flex-1">{children}</main>
                <Footer settings={settings} socials={socials} contacts={contacts} />
                <ActionBar settings={settings} socials={socials} />
            </body>
        </html>
    );
}
