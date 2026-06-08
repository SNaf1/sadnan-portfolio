import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@portfolio/db", "@portfolio/types"],
};

export default nextConfig;
