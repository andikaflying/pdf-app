import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SERVERLESS_TOKEN: process.env.SERVERLESS_TOKEN,
  },
};

export default nextConfig;
