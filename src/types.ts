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
