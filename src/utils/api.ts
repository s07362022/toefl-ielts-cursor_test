import axios from "axios";
import type { DailyLesson } from "@/types/lesson";
import { withBasePath } from "@/utils/base-path";

const api = axios.create({
  timeout: 15000,
  headers: { Accept: "application/json" },
});

/**
 * 從 public/data 載入指定天數的課程 JSON。
 * @param day - 課程天數（1–60）
 */
export async function fetchDailyLesson(day: number): Promise<DailyLesson> {
  const padded = String(day).padStart(3, "0");
  const response = await api.get<DailyLesson>(
    withBasePath(`/data/day_${padded}.json`),
  );
  return response.data;
}

/**
 * 從 days_index.json 取得歷史 Day 列表。
 */
export async function fetchDaysIndex() {
  const response = await api.get<import("@/types/lesson").DaysIndex>(
    withBasePath("/data/days_index.json"),
  );
  return response.data;
}

export default api;
