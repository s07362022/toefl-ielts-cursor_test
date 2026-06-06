"use client";

import { useCallback, useState } from "react";
import type { DailyLesson, DayIndexEntry, SectionId } from "@/types/lesson";
import { useProgress } from "@/hooks/use-progress";
import { fetchDailyLesson } from "@/utils/api";
import { Sidebar } from "@/components/sidebar";
import { Dashboard } from "@/components/dashboard";
import { VocabularyCards } from "@/components/vocabulary-cards";
import { ReadingPanel } from "@/components/reading-panel";
import { ListeningSpeakingPanel } from "@/components/listening-speaking-panel";
import { ToeflSkillDrill } from "@/components/toefl-skill-drill";
import { DailyQuiz } from "@/components/daily-quiz";
import { ProgressPanel } from "@/components/progress-panel";
import { DayEssencePage } from "@/components/day-essence-page";

interface LessonAppProps {
  initialLesson: DailyLesson;
  daysIndex: DayIndexEntry[];
  currentDay: number;
}

/**
 * 主學習介面：完整功能面板 + History 折疊選單切換各 Day。
 */
export function LessonApp({
  initialLesson,
  daysIndex,
  currentDay,
}: LessonAppProps) {
  const [section, setSection] = useState<SectionId>("dashboard");
  const [selectedDay, setSelectedDay] = useState(
    initialLesson.metadata?.day ?? currentDay,
  );
  const [lesson, setLesson] = useState<DailyLesson>(initialLesson);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessonDay = lesson.metadata?.day ?? selectedDay;

  const {
    progress,
    loaded,
    markComplete,
    toggleMemorized,
    saveDrillResponse,
    saveQuizScore,
    resetProgress,
    percent,
  } = useProgress(lessonDay);

  const navigate = useCallback((id: SectionId) => {
    setSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadDay = useCallback(async (day: number) => {
    setSelectedDay(day);
    setError(null);
    setLoading(true);
    try {
      const data = await fetchDailyLesson(day);
      setLesson(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        `無法載入 Day ${day}，請確認 day_${String(day).padStart(3, "0")}.json 存在。`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectDay = useCallback(
    async (day: number) => {
      if (day === selectedDay) return;
      await loadDay(day);
    },
    [selectedDay, loadDay],
  );

  const handleGoLatest = useCallback(async () => {
    if (selectedDay === currentDay) return;
    await loadDay(currentDay);
    setSection("dashboard");
  }, [selectedDay, currentDay, loadDay]);

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <Dashboard lesson={lesson} />;
      case "vocabulary":
        return (
          <VocabularyCards
            items={lesson.vocabulary ?? []}
            memorizedIds={progress.memorizedWords}
            onToggleMemorized={toggleMemorized}
            onComplete={() => {
              markComplete("vocabulary");
              navigate("reading");
            }}
          />
        );
      case "reading":
        return (
          <ReadingPanel
            reading={lesson.reading}
            onComplete={() => {
              markComplete("reading");
              navigate("listening");
            }}
          />
        );
      case "listening":
        return (
          <ListeningSpeakingPanel
            items={lesson.listening_speaking ?? []}
            onComplete={() => {
              markComplete("listening");
              navigate("drill");
            }}
          />
        );
      case "drill":
        return (
          <ToeflSkillDrill
            drill={lesson.toefl_skill_drill}
            savedResponse={progress.drillResponse}
            onSaveResponse={saveDrillResponse}
            onComplete={() => {
              markComplete("drill");
              navigate("quiz");
            }}
          />
        );
      case "quiz":
        return (
          <DailyQuiz
            questions={lesson.daily_quiz ?? []}
            onComplete={(score) => {
              saveQuizScore(score);
              markComplete("quiz");
            }}
          />
        );
      case "progress":
        return (
          <ProgressPanel
            progress={progress}
            vocabularyTotal={lesson.vocabulary?.length ?? 0}
            onReset={resetProgress}
          />
        );
      case "essence":
        return <DayEssencePage lesson={lesson} />;
      default:
        return null;
    }
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
        載入進度中…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar
        active={section}
        onNavigate={navigate}
        selectedDay={selectedDay}
        currentDay={currentDay}
        percent={percent}
        days={daysIndex}
        onSelectDay={handleSelectDay}
        onGoLatest={handleGoLatest}
        loading={loading}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
          {loading && (
            <p className="mb-4 text-sm text-[var(--muted)]">載入 Day {selectedDay}…</p>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {!error && !loading && (
            <>
              {selectedDay !== currentDay && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
                  <span>正在複習 Day {selectedDay} 的完整課程</span>
                  <button
                    type="button"
                    onClick={handleGoLatest}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    回到今日 Day {currentDay}
                  </button>
                </div>
              )}
              {renderSection()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
