"use client";

import { useCallback, useState } from "react";
import type { ListeningSpeakingItem } from "@/types/lesson";

interface ListeningSpeakingPanelProps {
  items: ListeningSpeakingItem[];
  onComplete?: () => void;
}

const FOCUS_LABELS: Record<string, string> = {
  linking: "連音",
  reduction: "弱化",
  stress: "重音",
  intonation: "語調",
  "flap t": "Flap T",
};

/**
 * 使用 Web Speech API 朗讀指定英文句子。
 * @param text - 要朗讀的文字
 */
function speakSentence(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * 聽力／口說跟讀面板，含發音提示與 TTS 播放。
 */
export function ListeningSpeakingPanel({
  items,
  onComplete,
}: ListeningSpeakingPanelProps) {
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const handleSpeak = useCallback((item: ListeningSpeakingItem) => {
    setSpeakingId(item.id);
    speakSentence(item.sentence);
    setTimeout(() => setSpeakingId(null), 3000);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">聽力 & 跟讀</h2>
        <p className="text-sm text-[var(--muted)]">
          共 {items.length} 句 · 建議每句跟讀 3 遍
          {!ttsSupported && " · 此瀏覽器不支援語音播放"}
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-base font-medium leading-relaxed text-[var(--foreground)]">
                  {item.sentence}
                </p>
                <span className="mt-2 inline-block rounded bg-[var(--bg)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]">
                  焦點：{FOCUS_LABELS[item.focus] ?? item.focus}
                </span>
              </div>
              {ttsSupported && (
                <button
                  type="button"
                  onClick={() => handleSpeak(item)}
                  disabled={speakingId === item.id}
                  className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-50"
                  aria-label={`播放第 ${index + 1} 句`}
                >
                  {speakingId === item.id ? "播放中…" : "▶ 播放"}
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <p className="text-[var(--muted)]">
                <strong className="text-[var(--foreground)]">發音提示：</strong>
                {item.pronunciation_tips_tw}
              </p>
              <p className="text-[var(--muted)]">
                <strong className="text-[var(--foreground)]">跟讀步驟：</strong>
                {item.shadowing_steps_tw}
              </p>
            </div>
          </article>
        ))}
      </div>

      {onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          完成跟讀練習
        </button>
      )}
    </div>
  );
}
