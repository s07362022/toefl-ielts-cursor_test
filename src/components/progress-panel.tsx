import type { DayProgress, ProgressKey } from "@/types/lesson";

interface ProgressPanelProps {
  progress: DayProgress;
  vocabularyTotal: number;
  onReset: () => void;
}

const SECTION_LABELS: Record<ProgressKey, string> = {
  vocabulary: "單字卡",
  reading: "閱讀",
  listening: "聽力口說",
  drill: "TOEFL 訓練",
  quiz: "每日測驗",
};

/**
 * 學習進度面板，顯示各區塊完成狀態與統計。
 */
export function ProgressPanel({
  progress,
  vocabularyTotal,
  onReset,
}: ProgressPanelProps) {
  const completedCount = Object.values(progress.completed).filter(Boolean).length;
  const total = Object.keys(progress.completed).length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold">學習進度</h2>
        <p className="text-sm text-[var(--muted)]">
          Day {progress.day} · 資料儲存於本機瀏覽器
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p className="font-display text-5xl font-bold text-[var(--accent)]">
          {percent}%
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          已完成 {completedCount} / {total} 個區塊
        </p>
        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {(Object.keys(SECTION_LABELS) as ProgressKey[]).map((key) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <span className="text-sm text-[var(--foreground)]">
              {SECTION_LABELS[key]}
            </span>
            <span
              className={`text-xs font-semibold ${
                progress.completed[key]
                  ? "text-emerald-600"
                  : "text-[var(--muted)]"
              }`}
            >
              {progress.completed[key] ? "✓ 完成" : "未完成"}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--muted)]">已記住單字</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
            {progress.memorizedWords.length}
            <span className="text-sm font-normal text-[var(--muted)]">
              {" "}
              / {vocabularyTotal}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--muted)]">測驗得分</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
            {progress.quizScore !== null ? `${progress.quizScore} / 3` : "—"}
          </p>
        </div>
      </div>

      {progress.drillResponse && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs font-medium text-[var(--muted)]">TOEFL 練習回答</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
            {progress.drillResponse}
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--muted)]">
        最後更新：{new Date(progress.updatedAt).toLocaleString("zh-TW")}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-red-300 hover:text-red-600"
      >
        重置今日進度
      </button>
    </div>
  );
}
