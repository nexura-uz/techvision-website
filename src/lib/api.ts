import { notFound } from "next/navigation";
import { cache } from "react";
import type { SiteSettings, SocialLink } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path: string) {
    // shortcut: every visit reads the API so admin edits show at once; add next.revalidate here if traffic outgrows the server.
    return fetch(`${API_URL}/api/${path}`, { cache: "no-store" });
}

/** For data a page cannot exist without: an API 404 becomes the site's 404 page. */
export async function api<T>(path: string): Promise<T> {
    const response = await request(path);
    if (response.status === 404) notFound();
    if (!response.ok) throw new Error(`API ${path} responded ${response.status}`);
    return response.json();
}

export const getSettings = cache(() => api<SiteSettings>("settings/"));
export const getSocialLinks = cache(() => api<SocialLink[]>("social-links/"));
