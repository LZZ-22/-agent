import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || "",
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  },
};

export default nextConfig;
