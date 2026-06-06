"use client";

import { useEffect, useState } from "react";
import type { ToeflSkillDrill as DrillData } from "@/types/lesson";

interface ToeflSkillDrillProps {
  drill: DrillData;
  savedResponse?: string;
  onSaveResponse?: (text: string) => void;
  onComplete?: () => void;
}

/**
 * TOEFL 技能訓練面板，含提示、範例與使用者回答輸入區。
 */
export function ToeflSkillDrill({
  drill,
  savedResponse = "",
  onSaveResponse,
  onComplete,
}: ToeflSkillDrillProps) {
  const [response, setResponse] = useState(savedResponse);
  const [showSample, setShowSample] = useState(false);

  useEffect(() => {
    setResponse(savedResponse);
  }, [savedResponse]);

  const handleChange = (text: string) => {
    setResponse(text);
    onSaveResponse?.(text);
  };

  return (
    <div className="space-y-5">
      <div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          {drill.skill_type.replace(/_/g, " ")}
        </span>
        <h2 className="mt-3 font-display text-xl font-bold">TOEFL 技能訓練</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{drill.instruction_tw}</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          題目
        </p>
        <p className="mt-2 text-base font-medium leading-relaxed text-[var(--foreground)]">
          {drill.prompt}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-4">
        <p className="text-xs font-medium text-[var(--accent)]">回答架構</p>
        <p className="mt-1 font-mono text-sm text-[var(--foreground)]">
          {drill.response_framework}
        </p>
      </div>

      <div>
        <label
          htmlFor="drill-response"
          className="text-sm font-medium text-[var(--foreground)]"
        >
          你的回答（自動儲存）
        </label>
        <textarea
          id="drill-response"
          value={response}
          onChange={(e) => handleChange(e.target.value)}
          rows={6}
          placeholder="在此輸入你的回答…"
          className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          {response.length} 字 · 建議練習 45 秒口說或寫一段完整回答
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowSample((v) => !v)}
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          {showSample ? "隱藏範例回答" : "顯示範例回答"}
        </button>
        {showSample && (
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--muted)]">
            {drill.sample_answer}
          </div>
        )}
      </div>

      {drill.useful_phrases?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[var(--muted)]">實用片語：</span>
          {drill.useful_phrases.map((phrase) => (
            <span
              key={phrase}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--foreground)]"
            >
              {phrase}
            </span>
          ))}
        </div>
      )}

      {onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          完成技能訓練
        </button>
      )}
    </div>
  );
}
