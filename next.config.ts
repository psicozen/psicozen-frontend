import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Experimental optimizations
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ["sonner", "react-hook-form", "zustand"],
  },

  // Enable strict mode for better error detection
  reactStrictMode: true,

  // Power bundle analyzer in development
  // Run: ANALYZE=true npm run build
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: true,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;
