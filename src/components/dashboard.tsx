import type { DailyLesson } from "@/types/lesson";

interface DashboardProps {
  lesson: DailyLesson;
}

/**
 * 課程總覽面板，顯示 metadata、文法重點與今日訓練類型。
 */
export function Dashboard({ lesson }: DashboardProps) {
  const { metadata, grammar_focus, toefl_skill_drill } = lesson;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-[var(--accent)]">
          Day {metadata.day} · {metadata.date_label} · {metadata.phase}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-[var(--foreground)]">
          {metadata.theme}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{metadata.weekday_plan}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "程度", value: metadata.level },
          { label: "預估時間", value: `${metadata.estimated_minutes} 分鐘` },
          { label: "階段", value: metadata.phase },
          {
            label: "技能訓練",
            value: toefl_skill_drill.skill_type.replace(/_/g, " "),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-[var(--foreground)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          備考焦點
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {metadata.exam_focus.map((focus) => (
            <span
              key={focus}
              className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
          今日文法重點
        </h3>
        <p className="mt-1 text-sm font-medium text-[var(--accent)]">
          {grammar_focus.title}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {grammar_focus.explanation_tw}
        </p>
        <div className="mt-4 space-y-2 rounded-lg bg-[var(--bg)] p-4 font-mono text-sm">
          <p className="text-[var(--foreground)]">{grammar_focus.pattern}</p>
          <p className="text-[var(--muted)]">{grammar_focus.example_basic}</p>
          <p className="text-[var(--foreground)]">{grammar_focus.example_advanced}</p>
        </div>
      </div>
    </div>
  );
}
