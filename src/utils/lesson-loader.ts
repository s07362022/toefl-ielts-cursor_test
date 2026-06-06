import type { DailyLesson, DayIndexEntry, DaysIndex } from "@/types/lesson";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

/**
 * 取得 public/data 目錄路徑。
 */
export function getDataDir(): string {
  return DATA_DIR;
}

/**
 * 掃描所有 day_XXX.json 並建立歷史索引。
 */
export function buildDaysIndex(): DaysIndex {
  const entries: DayIndexEntry[] = [];

  if (!fs.existsSync(DATA_DIR)) {
    return { updated_at: new Date().toISOString(), current_day: 1, days: [] };
  }

  for (const name of fs.readdirSync(DATA_DIR)) {
    const match = /^day_(\d{3})\.json$/.exec(name);
    if (!match) continue;

    const day = parseInt(match[1], 10);
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, name), "utf-8");
      const lesson = JSON.parse(raw) as DailyLesson;
      const meta = lesson.metadata;
      entries.push({
        day,
        theme: meta?.theme ?? `Day ${day}`,
        date_label: meta?.date_label ?? "",
        phase: meta?.phase ?? "Foundation",
        level: meta?.level ?? "B1+",
        estimated_minutes: meta?.estimated_minutes ?? 15,
        file: name,
      });
    } catch {
      entries.push({
        day,
        theme: `Day ${day}`,
        date_label: "",
        phase: "Foundation",
        level: "B1+",
        estimated_minutes: 15,
        file: name,
      });
    }
  }

  entries.sort((a, b) => a.day - b.day);

  let currentDay = entries.length ? entries[entries.length - 1].day : 1;
  const pointerPath = path.join(DATA_DIR, "current_day.json");
  try {
    const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf-8")) as {
      day: number;
    };
    if (pointer.day >= 1) currentDay = pointer.day;
  } catch {
    /* use max day */
  }

  return {
    updated_at: new Date().toISOString(),
    current_day: currentDay,
    days: entries,
  };
}

/**
 * 將歷史索引寫入 public/data/days_index.json。
 */
export function writeDaysIndexFile(): DaysIndex {
  const index = buildDaysIndex();
  fs.writeFileSync(
    path.join(DATA_DIR, "days_index.json"),
    JSON.stringify(index, null, 2) + "\n",
    "utf-8",
  );
  return index;
}

/**
 * 從磁碟讀取課程 JSON。
 * @param day - 課程天數
 */
export function loadLessonFromDisk(day: number): DailyLesson | null {
  try {
    const padded = String(day).padStart(3, "0");
    const filePath = path.join(DATA_DIR, `day_${padded}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as DailyLesson;
  } catch {
    return null;
  }
}
