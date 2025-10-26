// Global application types aggregated to avoid duplication across features.

export type Tab = "kursy" | "dane" | "ustalenia" | "platnosci" | "mobilna";

export type AppUser = {
  id: string;
  email?: string | null;
};

export type Lesson = {
  id: string;
  title: string;
  path: string;
  hasExercise: boolean;
};

export type LessonItem = {
  id: string;
  type: "lesson" | "exercise";
  title: string;
};

export type LessonContent = {
  id: string;
  title: string;
  content_md: string;
  pdf_path: string | null;
  heading: string | null;
};

export type Chapter = {
  id: string;
  title: string;
  lessons: LessonItem[];
};

export type CourseStructure = {
  chapters: Chapter[];
};

export type Course = {
  id: string;
  title: string;
  level?: string;
  price: number;
  short_description?: string | null;
  duration?: string | null;
  features?: string[];
  created_at?: string | null;
  first_lesson_id?: string | null;
};

export type CourseWithStructure = Course & {
  structure: CourseStructure;
};

export type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
  regenerate_count?: number | null;
};

export type SubscriptionStatus = "active" | "canceled" | "expired";
export type SubscriptionPlan = "monthly" | "yearly" | "free_trial";

export type Subscription = {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  payment_provider: string | null;
  payment_id: string | null;
  started_at: string | null;
  period_end: string;
  created_at: string;
  plan: SubscriptionPlan;
  price_id: string;
};

export type PurchaseCourseRef = string | { id: string; title?: string };

export type Purchase = {
  id: string;
  user_id: string;
  course: PurchaseCourseRef;
  payment_status: "unpaid" | "paid" | "failed";
  paid_at: string | null;
  payment_provider: string | null;
  payment_id: string | null;
  created_at: string;
  price_id: string | null;
};

export type SidebarItem =
  | { type: "lesson"; id: string; title: string }
  | { type: "exercise"; forLessonId: string };

export type SidebarCategory = {
  label: string;
  items: SidebarItem[];
};

export type SidebarSection = {
  level: string;
  topics: SidebarCategory[];
};

export type NavItem = {
  id: string;
  type: "lesson" | "exercise";
  title: string;
};

export type FooterNav = {
  type: "lessons" | "exercise";
  id: string;
};

export type FillGapsItem = {
  prompt: string;
  answer: string | string[];
  hint?: string;
  wrongMessage?: string;
};

export type ChooseDefinitionItem = {
  word: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  wrongMessage?: string;
};

export type TranslateItem = {
  source: string;
  target: string | string[];
  hint?: string;
  wrongMessage?: string;
};

export type ExerciseData = {
  fillGaps: FillGapsItem[];
  chooseDefinition: ChooseDefinitionItem[];
  translate: TranslateItem[];
};

export type BlogPost = {
  id: number;
  title: string;
  image_link: string | null;
  blog: string;
  created_at: string;
};

export type PracticeTaskType =
  | "cloze_test"
  | "fill_in_blank"
  | "multiple_choice"
  | "error_correction"
  | "sentence_builder";

export type PracticeTaskBase = {
  id: number;
  hint?: string;
  type: PracticeTaskType;
  errors?: string[];
  answers: string[];
  question: string;
  answer_key?: string;
};

export type ClozePracticeTask = PracticeTaskBase & {
  type: "cloze_test" | "fill_in_blank" | "error_correction";
};

export type MultipleChoicePracticeTask = PracticeTaskBase & {
  type: "multiple_choice";
  options: string[];
};

export type SentenceBuilderPracticeTask = PracticeTaskBase & {
  type: "sentence_builder";
  words: string[];
};

export type PracticeTask =
  | ClozePracticeTask
  | MultipleChoicePracticeTask
  | SentenceBuilderPracticeTask;

export type PracticeFlashcard = {
  id: number;
  hint?: string;
  level?: string | null;
  question: string;
  correct_answer: string;
  example_sentence?: string;
};

export type PracticeVocabularyItem = {
  id: number;
  word: string;
  options: string[];
  correct_answer: string;
  hint?: string;
};

export type PracticeVocabularyMap = Record<string, PracticeVocabularyItem[]>;

export type MobileLevel = {
  id: string;
  level: string;
  tasks: PracticeTask[];
  flashcards: PracticeFlashcard[];
  vocabulary: PracticeVocabularyMap;
  created_at: string | null;
};
