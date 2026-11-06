export interface NamedImage {
    id: number;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    category: number | null;
    category_details: NamedImage | null;
    brand: number | null;
    brand_details: NamedImage | null;
    price: string;
    discount: number;
    final_price: string;
    warranty: string;
    overview_video_url: string;
    tutorial_video_url: string;
    is_in_stock: boolean;
    is_new: boolean;
    is_featured: boolean;
    images: { id: number; image: string }[];
    specs: { name: string; value: string }[];
    updated_at: string;
}

export interface Paged<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Banner {
    id: number;
    image: string;
    url: string;
}

export interface News {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string;
    created_at: string;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
}

/** Public rows from Django admin; staff may not have entered any given key yet. */
export type SiteSettings = Partial<Record<"usd_rate" | "phone" | "working_hours", string>>;

export interface SocialLink {
    id: number;
    platform: string;
    url: string;
}

export interface Contact {
    id: number;
    region_details: { name: string };
    store_name: string;
    address: string;
    latitude: string;
    longitude: string;
    phone_1: string;
    phone_2: string;
}

export interface Region {
    id: number;
    name: string;
}
