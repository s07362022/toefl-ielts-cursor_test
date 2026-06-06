"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { ReadingSection } from "@/types/lesson";

interface ReadingPanelProps {
  reading: ReadingSection;
  onComplete?: () => void;
}

/**
 * 將 embedded_words 在閱讀文中高亮顯示。
 * @param text - 原文
 * @param words - 需高亮的單字清單
 */
function highlightText(text: string, words: string[]): ReactNode[] {
  if (!words.length) return [text];

  const pattern = new RegExp(
    `\\b(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi",
  );

  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const isHighlight = words.some(
      (w) => w.toLowerCase() === part.toLowerCase(),
    );
    if (isHighlight) {
      return (
        <mark
          key={`${part}-${i}`}
          className="rounded bg-amber-200/80 px-0.5 font-semibold text-amber-900"
        >
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${i}`}>{part}</span>;
  });
}

/**
 * 閱讀面板，顯示英文短文、高亮單字與中文翻譯。
 */
export function ReadingPanel({ reading, onComplete }: ReadingPanelProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  const highlighted = useMemo(
    () => highlightText(reading.text, reading.embedded_words ?? []),
    [reading.text, reading.embedded_words],
  );

  const wordCount = reading.text.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">{reading.title}</h2>
        <p className="text-sm text-[var(--muted)]">約 {wordCount} 字</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-base leading-8 text-[var(--foreground)]">{highlighted}</p>
      </div>

      {reading.embedded_words?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[var(--muted)]">今日嵌入單字：</span>
          {reading.embedded_words.map((w) => (
            <span
              key={w}
              className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-800"
            >
              {w}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowTranslation((v) => !v)}
        className="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        {showTranslation ? "隱藏中文翻譯" : "顯示中文翻譯"}
      </button>

      {showTranslation && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 text-sm leading-relaxed text-[var(--muted)]">
          {reading.translation_tw}
        </div>
      )}

      {onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          完成閱讀
        </button>
      )}
    </div>
  );
}
