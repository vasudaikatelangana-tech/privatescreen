import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // ← ignores TS errors
  },
  eslint: {
    ignoreDuringBuilds: true,  // ← ignores ESLint errors
  },
};

export default nextConfig;