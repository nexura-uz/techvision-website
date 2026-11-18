import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // photos come straight from the API's media folder (or Icecat), sized by src/lib/image-loader.ts, never resized here
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  // addresses of the old site (until 2026-11), so links from Google and Instagram keep working; the query (?q=) is kept
  async redirects() {
    return [
      { source: "/categories", destination: "/catalog", permanent: true },
      { source: "/categories/:slug", destination: "/catalog/:slug", permanent: true },
      { source: "/brands", destination: "/catalog", permanent: true },
      { source: "/brands/:slug", destination: "/catalog?brand=:slug", permanent: true },
      { source: "/search", destination: "/catalog", permanent: true },
    ];
  },
};

export default nextConfig;
