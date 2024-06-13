const path = require('path');

/** @type {import('next').NextConfig} */
require("dotenv").config();
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, os: false, path: false};

    return config;
  },
};

module.exports = nextConfig;
