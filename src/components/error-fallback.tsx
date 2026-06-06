interface ErrorFallbackProps {
  title: string;
  messages: string[];
}

/**
 * 資料載入或驗證失敗時的友善提示畫面。
 */
export function ErrorFallback({ title, messages }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-8">
      <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-3xl">⚠</p>
        <h1 className="mt-4 font-display text-xl font-bold text-[var(--foreground)]">
          {title}
        </h1>
        <ul className="mt-4 space-y-1 text-left text-sm text-[var(--muted)]">
          {messages.map((msg) => (
            <li key={msg}>· {msg}</li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-[var(--muted)]">
          請確認 <code className="rounded bg-[var(--bg)] px-1">public/data/day_001.json</code>{" "}
          存在且格式正確。
        </p>
      </div>
    </div>
  );
}
