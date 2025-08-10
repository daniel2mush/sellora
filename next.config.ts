import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
  experimental: {
    esmExternals: "loose", // Allow ESM packages like @react-pdf/renderer
  },
};

export default nextConfig;
