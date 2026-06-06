/**
 * GitHub Pages 子路徑前綴（本機開發為空字串）。
 * 建置時由 NEXT_PUBLIC_BASE_PATH 注入。
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 加上 basePath 的公開資源 URL。
 * @param path - 以 / 開頭的路徑
 */
export function withBasePath(path: string): string {
  if (!basePath) return path;
  return `${basePath}${path}`;
}
