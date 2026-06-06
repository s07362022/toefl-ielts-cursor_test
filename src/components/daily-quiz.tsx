"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/lesson";

interface DailyQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

/**
 * 從選項字串擷取選項代號（A/B/C/D）。
 * @param option - 如 "A. Method"
 */
function getOptionLetter(option: string): string {
  return option.trim().charAt(0).toUpperCase();
}

/**
 * 每日測驗面板，三題選擇題含作答回饋。
 */
export function DailyQuiz({ questions, onComplete }: DailyQuizProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, letter: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: letter }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = questions.filter(
      (q) => answers[q.question_id] === q.answer.toUpperCase(),
    ).length;
    onComplete?.(score);
  };

  const allAnswered = questions.every((q) => answers[q.question_id]);
  const score = submitted
    ? questions.filter(
        (q) => answers[q.question_id] === q.answer.toUpperCase(),
      ).length
    : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold">每日測驗</h2>
        <p className="text-sm text-[var(--muted)]">共 {questions.length} 題選擇題</p>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => {
          const selected = answers[q.question_id];
          const isCorrect =
            submitted && selected === q.answer.toUpperCase();
          const isWrong =
            submitted &&
            selected &&
            selected !== q.answer.toUpperCase();

          return (
            <article
              key={q.question_id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-xs font-medium text-[var(--muted)]">
                第 {index + 1} 題
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--foreground)]">
                {q.question}
              </p>

              <div className="mt-4 space-y-2">
                {q.options.map((option) => {
                  const letter = getOptionLetter(option);
                  const isSelected = selected === letter;
                  let optionClass =
                    "border-[var(--border)] hover:border-[var(--accent)]/50";

                  if (submitted) {
                    if (letter === q.answer.toUpperCase()) {
                      optionClass = "border-emerald-400 bg-emerald-50";
                    } else if (isSelected) {
                      optionClass = "border-red-300 bg-red-50";
                    }
                  } else if (isSelected) {
                    optionClass = "border-[var(--accent)] bg-[var(--accent-soft)]";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(q.question_id, letter)}
                      disabled={submitted}
                      className={`flex w-full items-center rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${optionClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`mt-4 rounded-lg p-3 text-sm ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-800"
                      : isWrong
                        ? "bg-red-50 text-red-800"
                        : "bg-[var(--bg)] text-[var(--muted)]"
                  }`}
                >
                  <strong>{isCorrect ? "正確！" : `正確答案：${q.answer}`}</strong>
                  <p className="mt-1">{q.explanation_tw}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          提交答案
        </button>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">
            {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">測驗完成</p>
        </div>
      )}
    </div>
  );
}
