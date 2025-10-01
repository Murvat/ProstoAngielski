// ─── Raw course structure ────────────────────────────────
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

export type Chapter = {
  id: string;
  title: string;
  lessons: LessonItem[];
};


export type Course = {
  id: string;
  title: string;
  short_description?: string;
  level?: string;
  duration?: string;
  price: number;
  features?: string[];
  created_at?: string;
  first_lesson_id?: string | null;
  structure: {
    chapters: Chapter[];
  };
};

// ─── UI-ready sidebar types ───────────────────────────────
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
