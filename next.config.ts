import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  /** Disable compression to avoid buffering AI text streams in local dev. */
  compress: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
