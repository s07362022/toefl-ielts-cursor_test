/** 單字類別 */
export type VocabularyCategory =
  | "Daily"
  | "Business"
  | "TOEFL"
  | "IELTS"
  | "Academic";

/** 單字學習狀態 */
export type VocabularyStatus = "new" | "review";

/** 跟讀焦點類型 */
export type PronunciationFocus =
  | "linking"
  | "reduction"
  | "stress"
  | "intonation"
  | "flap t";

/** TOEFL 技能訓練類型 */
export type SkillType =
  | "reading_inference"
  | "listening_note_taking"
  | "independent_speaking"
  | "integrated_speaking_basic"
  | "academic_discussion_writing"
  | "mixed_review"
  | string;

/** 課程階段 */
export type Phase = "Foundation" | "Development" | "Sprint" | string;

/** 側邊欄功能區塊 */
export type SectionId =
  | "dashboard"
  | "vocabulary"
  | "reading"
  | "listening"
  | "drill"
  | "quiz"
  | "progress"
  | "essence";

/** 歷史紀錄索引項目（側邊欄 Day 列表） */
export interface DayIndexEntry {
  day: number;
  theme: string;
  date_label: string;
  phase: Phase;
  level: string;
  estimated_minutes: number;
  file: string;
}

/** 全部課程歷史索引 */
export interface DaysIndex {
  updated_at: string;
  current_day: number;
  days: DayIndexEntry[];
}

/** 單字項目 */
export interface VocabularyItem {
  id: number;
  word: string;
  type: string;
  phonetic_us: string;
  category: VocabularyCategory;
  status: VocabularyStatus;
  definition_tw: string;
  example: string;
  collocation: string;
  usage_note_tw: string;
}

/** 文法重點 */
export interface GrammarFocus {
  title: string;
  function: string;
  explanation_tw: string;
  pattern: string;
  example_basic: string;
  example_advanced: string;
}

/** 閱讀段落 */
export interface ReadingSection {
  title: string;
  text: string;
  embedded_words: string[];
  translation_tw: string;
}

/** 聽力／口說跟讀句 */
export interface ListeningSpeakingItem {
  id: number;
  sentence: string;
  pronunciation_tips_tw: string;
  shadowing_steps_tw: string;
  focus: PronunciationFocus;
}

/** TOEFL 技能訓練 */
export interface ToeflSkillDrill {
  skill_type: SkillType;
  instruction_tw: string;
  prompt: string;
  response_framework: string;
  sample_answer: string;
  useful_phrases: string[];
}

/** 每日測驗題 */
export interface QuizQuestion {
  question_id: number;
  question: string;
  options: string[];
  answer: string;
  explanation_tw: string;
}

/** 課程 metadata */
export interface LessonMetadata {
  day: number;
  date_label: string;
  phase: Phase;
  level: string;
  estimated_minutes: number;
  exam_focus: string[];
  theme: string;
  weekday_plan: string;
}

/** Gmail 信件（前端僅供參考） */
export interface GmailEmail {
  recipient: string;
  subject: string;
  html_body: string;
}

/** 歷史更新紀錄 */
export interface HistoryUpdate {
  new_words_today: string[];
  review_words_today: string[];
  grammar_today: string;
  theme_today: string;
  skill_type_today: string;
}

/** 完整每日課程 JSON */
export interface DailyLesson {
  metadata: LessonMetadata;
  vocabulary: VocabularyItem[];
  grammar_focus: GrammarFocus;
  reading: ReadingSection;
  listening_speaking: ListeningSpeakingItem[];
  toefl_skill_drill: ToeflSkillDrill;
  daily_quiz: QuizQuestion[];
  gmail_email?: GmailEmail;
  history_update?: HistoryUpdate;
}

/** localStorage 進度項目 */
export type ProgressKey =
  | "vocabulary"
  | "reading"
  | "listening"
  | "drill"
  | "quiz";

/** 當日學習進度 */
export interface DayProgress {
  day: number;
  completed: Record<ProgressKey, boolean>;
  memorizedWords: number[];
  quizScore: number | null;
  drillResponse: string;
  updatedAt: string;
}
