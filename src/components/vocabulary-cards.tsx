"use client";

import { useMemo, useState } from "react";
import type { VocabularyItem, VocabularyStatus } from "@/types/lesson";

type FilterStatus = "all" | VocabularyStatus;

interface VocabularyCardsProps {
  items: VocabularyItem[];
  memorizedIds: number[];
  onToggleMemorized: (id: number) => void;
  onComplete?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Daily: "bg-emerald-500/15 text-emerald-700",
  Business: "bg-blue-500/15 text-blue-700",
  TOEFL: "bg-amber-500/15 text-amber-800",
  IELTS: "bg-violet-500/15 text-violet-700",
  Academic: "bg-rose-500/15 text-rose-700",
};

/**
 * 單字卡列表，支援 new/review 篩選與「已記住」標記。
 */
export function VocabularyCards({
  items,
  memorizedIds,
  onToggleMemorized,
  onComplete,
}: VocabularyCardsProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((v) => v.status === filter);
  }, [items, filter]);

  const newCount = items.filter((v) => v.status === "new").length;
  const reviewCount = items.filter((v) => v.status === "review").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">單字卡</h2>
          <p className="text-sm text-[var(--muted)]">
            共 {items.length} 詞 · 新詞 {newCount} · 複習 {reviewCount}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "new", "review"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {f === "all" ? "全部" : f === "new" ? "新詞" : "複習"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((item) => {
          const isMemorized = memorizedIds.includes(item.id);
          const isExpanded = expandedId === item.id;
          const catClass =
            CATEGORY_COLORS[item.category] ?? "bg-gray-500/15 text-gray-700";

          return (
            <article
              key={item.id}
              className={`rounded-xl border bg-[var(--surface)] transition-shadow ${
                isMemorized
                  ? "border-emerald-300/60 opacity-80"
                  : "border-[var(--border)]"
              }`}
            >
              <button
                type="button"
                className="w-full p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-[var(--foreground)]">
                        {item.word}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{item.type}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${catClass}`}
                      >
                        {item.category}
                      </span>
                      {item.status === "review" && (
                        <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
                          複習
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                      {item.phonetic_us}
                    </p>
                    <p className="mt-2 text-sm text-[var(--foreground)]">
                      {item.definition_tw}
                    </p>
                  </div>
                  <span className="text-[var(--muted)]">{isExpanded ? "−" : "+"}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3 text-sm">
                  <p className="italic text-[var(--foreground)]">{item.example}</p>
                  <p className="mt-2 text-[var(--muted)]">
                    <strong>搭配：</strong>
                    {item.collocation}
                  </p>
                  <p className="mt-1 text-[var(--muted)]">{item.usage_note_tw}</p>
                </div>
              )}

              <div className="border-t border-[var(--border)] px-4 py-2">
                <button
                  type="button"
                  onClick={() => onToggleMemorized(item.id)}
                  className={`text-xs font-medium transition-colors ${
                    isMemorized
                      ? "text-emerald-600"
                      : "text-[var(--muted)] hover:text-[var(--accent)]"
                  }`}
                >
                  {isMemorized ? "✓ 已記住" : "標記為已記住"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          完成單字學習
        </button>
      )}
    </div>
  );
}
