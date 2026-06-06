"use client";

import { useCallback, useEffect, useState } from "react";
import type { DayProgress, ProgressKey } from "@/types/lesson";

const STORAGE_PREFIX = "toefl-ielts-progress";

/**
 * 產生 localStorage 鍵名。
 * @param day - 課程天數
 */
function storageKey(day: number): string {
  return `${STORAGE_PREFIX}-day-${day}`;
}

/**
 * 建立預設進度物件。
 * @param day - 課程天數
 */
function createDefaultProgress(day: number): DayProgress {
  return {
    day,
    completed: {
      vocabulary: false,
      reading: false,
      listening: false,
      drill: false,
      quiz: false,
    },
    memorizedWords: [],
    quizScore: null,
    drillResponse: "",
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 管理當日學習進度與 localStorage 持久化。
 * @param day - 課程天數
 */
export function useProgress(day: number) {
  const [progress, setProgress] = useState<DayProgress>(() =>
    createDefaultProgress(day),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(day));
      if (raw) {
        setProgress(JSON.parse(raw) as DayProgress);
      } else {
        setProgress(createDefaultProgress(day));
      }
    } catch {
      setProgress(createDefaultProgress(day));
    }
    setLoaded(true);
  }, [day]);

  const persist = useCallback(
    (next: DayProgress) => {
      const withTimestamp = { ...next, updatedAt: new Date().toISOString() };
      setProgress(withTimestamp);
      localStorage.setItem(storageKey(day), JSON.stringify(withTimestamp));
    },
    [day],
  );

  /** 標記某區塊為已完成 */
  const markComplete = useCallback(
    (key: ProgressKey) => {
      setProgress((prev) => {
        const next = {
          ...prev,
          completed: { ...prev.completed, [key]: true },
        };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  /** 切換單字「已記住」狀態 */
  const toggleMemorized = useCallback(
    (wordId: number) => {
      setProgress((prev) => {
        const exists = prev.memorizedWords.includes(wordId);
        const memorizedWords = exists
          ? prev.memorizedWords.filter((id) => id !== wordId)
          : [...prev.memorizedWords, wordId];
        const next = { ...prev, memorizedWords };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  /** 儲存 TOEFL 口說／寫作練習回答 */
  const saveDrillResponse = useCallback(
    (text: string) => {
      setProgress((prev) => {
        const next = { ...prev, drillResponse: text };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  /** 記錄測驗得分（答對題數） */
  const saveQuizScore = useCallback(
    (score: number) => {
      setProgress((prev) => {
        const next = { ...prev, quizScore: score };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  /** 重置當日進度 */
  const resetProgress = useCallback(() => {
    const fresh = createDefaultProgress(day);
    persist(fresh);
  }, [day, persist]);

  const completedCount = Object.values(progress.completed).filter(Boolean).length;
  const totalSections = Object.keys(progress.completed).length;
  const percent = Math.round((completedCount / totalSections) * 100);

  return {
    progress,
    loaded,
    markComplete,
    toggleMemorized,
    saveDrillResponse,
    saveQuizScore,
    resetProgress,
    completedCount,
    totalSections,
    percent,
  };
}
