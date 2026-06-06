import type { DailyLesson } from "@/types/lesson";

/**
 * 驗證課程 JSON 是否符合基本結構，回傳錯誤訊息陣列。
 * @param lesson - 待驗證的課程資料
 */
export function validateLesson(lesson: unknown): string[] {
  const errors: string[] = [];

  if (!lesson || typeof lesson !== "object") {
    return ["課程資料格式無效"];
  }

  const data = lesson as Partial<DailyLesson>;

  if (!data.metadata?.day) {
    errors.push("缺少 metadata.day");
  }
  if (!data.metadata?.theme) {
    errors.push("缺少 metadata.theme");
  }
  if (!Array.isArray(data.vocabulary) || data.vocabulary.length < 15) {
    errors.push("vocabulary 需至少 15 個單字");
  }
  if (!data.reading?.text) {
    errors.push("缺少 reading.text");
  }
  if (!Array.isArray(data.listening_speaking) || data.listening_speaking.length !== 3) {
    errors.push("listening_speaking 需剛好 3 句");
  }
  if (!data.toefl_skill_drill?.prompt) {
    errors.push("缺少 toefl_skill_drill");
  }
  if (!Array.isArray(data.daily_quiz) || data.daily_quiz.length !== 3) {
    errors.push("daily_quiz 需剛好 3 題");
  }

  return errors;
}
