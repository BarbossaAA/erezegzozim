import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // fully static site — exported to /out and served from a static host (GitHub Pages)
  output: "export",
};

export default nextConfig;
