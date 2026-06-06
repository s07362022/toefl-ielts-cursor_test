"use client";

import { useMemo, useState } from "react";
import type { DailyLesson } from "@/types/lesson";

interface DayEssencePageProps {
  lesson: DailyLesson;
}

/**
 * 精華一頁：濃縮呈現當日所有學習重點，方便複習。
 */
export function DayEssencePage({ lesson }: DayEssencePageProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);

  const { metadata, vocabulary, grammar_focus, reading, listening_speaking, toefl_skill_drill, daily_quiz } =
    lesson;

  const newWords = vocabulary.filter((v) => v.status === "new");
  const reviewWords = vocabulary.filter((v) => v.status === "review");

  const highlightedReading = useMemo(() => {
    const words = reading.embedded_words ?? [];
    if (!words.length) return reading.text;

    const pattern = new RegExp(
      `\\b(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
      "gi",
    );
    const parts = reading.text.split(pattern);
    return parts.map((part, i) => {
      const hit = words.some((w) => w.toLowerCase() === part.toLowerCase());
      return hit ? (
        <mark key={`${part}-${i}`} className="rounded bg-amber-200/70 px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        <span key={`${part}-${i}`}>{part}</span>
      );
    });
  }, [reading]);

  return (
    <article className="space-y-5">
      {/* 標題區 */}
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--accent)]">
          <span>Day {metadata.day}</span>
          <span>·</span>
          <span>{metadata.date_label}</span>
          <span>·</span>
          <span>{metadata.phase}</span>
          <span>·</span>
          <span>{metadata.level}</span>
          <span>·</span>
          <span>{metadata.estimated_minutes} 分鐘</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold leading-snug text-[var(--foreground)]">
          {metadata.theme}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{metadata.weekday_plan}</p>
      </header>

      {/* 單字精華 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          單字精華 · {vocabulary.length} 詞
        </h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          新詞 {newWords.length} · 複習 {reviewWords.length}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {vocabulary.map((v) => (
            <div
              key={v.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
            >
              <div className="flex items-baseline gap-2">
                <strong className="text-[var(--foreground)]">{v.word}</strong>
                <span className="text-xs text-[var(--muted)]">{v.phonetic_us}</span>
                {v.status === "review" && (
                  <span className="rounded bg-orange-100 px-1 text-[10px] text-orange-700">
                    複習
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{v.definition_tw}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 文法 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          文法句型
        </h2>
        <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
          {grammar_focus.title}
        </p>
        <p className="mt-1 font-mono text-sm text-[var(--accent)]">{grammar_focus.pattern}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{grammar_focus.example_advanced}</p>
      </section>

      {/* 閱讀 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          閱讀 · {reading.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">
          {highlightedReading}
        </p>
        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          className="mt-3 text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {showTranslation ? "隱藏翻譯" : "顯示中文翻譯"}
        </button>
        {showTranslation && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {reading.translation_tw}
          </p>
        )}
      </section>

      {/* 跟讀 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          跟讀 3 句
        </h2>
        <ol className="mt-3 space-y-3">
          {listening_speaking.map((item, i) => (
            <li key={item.id} className="text-sm">
              <span className="mr-2 font-bold text-[var(--accent)]">{i + 1}.</span>
              <span className="text-[var(--foreground)]">{item.sentence}</span>
              <p className="mt-1 pl-5 text-xs text-[var(--muted)]">
                {item.pronunciation_tips_tw}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* TOEFL 訓練 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
          TOEFL 訓練 · {toefl_skill_drill.skill_type.replace(/_/g, " ")}
        </h2>
        <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
          {toefl_skill_drill.prompt}
        </p>
        <p className="mt-2 font-mono text-xs text-[var(--muted)]">
          {toefl_skill_drill.response_framework}
        </p>
      </section>

      {/* 測驗 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
            測驗 3 題
          </h2>
          <button
            type="button"
            onClick={() => setShowQuizAnswers((v) => !v)}
            className="text-xs font-medium text-[var(--accent)] hover:underline"
          >
            {showQuizAnswers ? "隱藏答案" : "顯示答案"}
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {daily_quiz.map((q) => (
            <div key={q.question_id} className="text-sm">
              <p className="font-medium text-[var(--foreground)]">
                {q.question_id}. {q.question}
              </p>
              <ul className="mt-1 space-y-0.5 pl-4 text-xs text-[var(--muted)]">
                {q.options.map((opt) => (
                  <li key={opt}>{opt}</li>
                ))}
              </ul>
              {showQuizAnswers && (
                <p className="mt-1 text-xs text-emerald-700">
                  答案 {q.answer} — {q.explanation_tw}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
