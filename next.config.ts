import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // fully static site — exported to /out and served from a static host (GitHub Pages)
  output: "export",
  // emit routes as directories (custom/index.html) so any static host serves them
  trailingSlash: true,
};

export default nextConfig;
