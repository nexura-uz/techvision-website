import type { NextConfig } from "next";

const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");

const nextConfig: NextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: api.protocol.replace(":", "") as "http" | "https",
                hostname: api.hostname,
                port: api.port,
                pathname: "/media/**",
            },
        ],
    },
};

export default nextConfig;
