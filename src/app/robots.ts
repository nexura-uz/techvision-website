import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/api";

export default function robots(): MetadataRoute.Robots {
  return {
    // the cart is personal; search results are endless variations of the catalog
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/catalog?q="] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
