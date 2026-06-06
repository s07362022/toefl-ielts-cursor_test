"use client";

import { useState } from "react";
import type { DayIndexEntry, SectionId } from "@/types/lesson";

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "總覽", icon: "◈" },
  { id: "vocabulary", label: "單字卡", icon: "▤" },
  { id: "reading", label: "閱讀", icon: "▥" },
  { id: "listening", label: "聽力口說", icon: "◎" },
  { id: "drill", label: "TOEFL 訓練", icon: "▶" },
  { id: "quiz", label: "每日測驗", icon: "?" },
  { id: "progress", label: "學習進度", icon: "◉" },
  { id: "essence", label: "精華一頁", icon: "◇" },
];

interface SidebarProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  selectedDay: number;
  currentDay: number;
  percent: number;
  days: DayIndexEntry[];
  onSelectDay: (day: number) => void;
  onGoLatest: () => void;
  loading?: boolean;
}

/**
 * 側邊欄：完整功能導覽 + 可展開的 History（Day 列表）。
 */
export function Sidebar({
  active,
  onNavigate,
  selectedDay,
  currentDay,
  percent,
  days,
  onSelectDay,
  onGoLatest,
  loading = false,
}: SidebarProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const isLatest = selectedDay === currentDay;

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-white/10 bg-[var(--sidebar-bg)]">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          TOEFL / IELTS
        </p>
        <h1 className="mt-1 font-display text-xl font-bold text-white">每日微課程</h1>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm text-slate-300">
            Day {selectedDay}
            {!isLatest && (
              <span className="ml-1 text-xs text-slate-500">（複習）</span>
            )}
          </p>
          {!isLatest && (
            <button
              type="button"
              onClick={onGoLatest}
              className="rounded bg-[var(--accent)]/90 px-1.5 py-0.5 text-[10px] font-bold text-white hover:opacity-90"
            >
              回今日
            </button>
          )}
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-slate-400">
            <span>{isLatest ? "今日進度" : `Day ${selectedDay} 進度`}</span>
            <span>{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
              active === item.id
                ? "bg-white/10 font-semibold text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span className="w-4 text-center text-xs opacity-70">{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* History 折疊區 */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
              historyOpen
                ? "bg-white/8 font-semibold text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-4 text-center text-xs opacity-70">☰</span>
              History 歷史
            </span>
            <span className="text-xs opacity-60">{historyOpen ? "−" : "+"}</span>
          </button>

          {historyOpen && (
            <div className="mt-1 space-y-0.5 border-l border-white/10 pl-2 ml-3">
              {days.map((entry) => {
                const isSelected = entry.day === selectedDay;
                const isDayLatest = entry.day === currentDay;
                return (
                  <button
                    key={entry.day}
                    type="button"
                    onClick={() => onSelectDay(entry.day)}
                    disabled={loading}
                    className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-white/12 text-white"
                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                    } ${loading ? "opacity-50" : ""}`}
                  >
                    <span className="font-semibold">
                      Day {entry.day}
                      {isDayLatest && (
                        <span className="ml-1 rounded bg-[var(--accent)]/80 px-1 py-px text-[9px] text-white">
                          最新
                        </span>
                      )}
                    </span>
                    <p className="mt-0.5 line-clamp-1 opacity-75">{entry.theme}</p>
                  </button>
                );
              })}
              {days.length === 0 && (
                <p className="px-2 py-2 text-xs text-slate-600">尚無紀錄</p>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-white/10 px-5 py-3 text-[10px] text-slate-500">
        共 {days.length} 天 · 每日 10–20 分鐘
      </div>
    </aside>
  );
}
