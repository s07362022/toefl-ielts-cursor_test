/**
 * 建置 GitHub Pages 靜態站（含 basePath）。
 */
import { spawnSync } from "node:child_process";

const REPO = "toefl-ielts-cursor_test";

const env = {
  ...process.env,
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_BASE_PATH: `/${REPO}`,
};

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env,
});

process.exit(result.status ?? 1);
