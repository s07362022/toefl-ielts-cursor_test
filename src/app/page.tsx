import { LessonApp } from "@/components/lesson-app";
import { ErrorFallback } from "@/components/error-fallback";
import { validateLesson } from "@/utils/lesson-validator";
import { loadLessonFromDisk, writeDaysIndexFile } from "@/utils/lesson-loader";

/**
 * 首頁：載入歷史索引與最新課程，支援左側 Day 切換複習。
 */
export default function HomePage() {
  const daysIndex = writeDaysIndexFile();
  const currentDay = daysIndex.current_day;
  const defaultDay =
    daysIndex.days.find((d) => d.day === currentDay)?.day ??
    daysIndex.days[daysIndex.days.length - 1]?.day ??
    1;

  const lesson = loadLessonFromDisk(defaultDay);

  if (!daysIndex.days.length) {
    return (
      <ErrorFallback
        title="尚無歷史課程"
        messages={[
          "public/data/ 內沒有任何 day_XXX.json",
          "請執行 run_daily_pipeline.bat 或對助理說「每日英文學習」",
        ]}
      />
    );
  }

  if (!lesson) {
    return (
      <ErrorFallback
        title="找不到課程資料"
        messages={[
          `無法讀取 day_${String(defaultDay).padStart(3, "0")}.json`,
          `目前已索引 ${daysIndex.days.length} 天：${daysIndex.days.map((d) => d.day).join(", ")}`,
        ]}
      />
    );
  }

  const errors = validateLesson(lesson);
  if (errors.length > 0) {
    return (
      <ErrorFallback title="課程資料驗證失敗" messages={errors} />
    );
  }

  return (
    <LessonApp
      initialLesson={lesson}
      daysIndex={daysIndex.days}
      currentDay={currentDay}
    />
  );
}
