import type { NextConfig } from "next";

/** GitHub Pages 專案頁 repo 名稱（須含 cursor_test） */
const GITHUB_REPO = "toefl-ielts-cursor_test";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? `/${GITHUB_REPO}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
