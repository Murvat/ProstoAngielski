export type Course = {
    id: string;
    title: string;
    chapters: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        path: string;
        hasExercise: boolean;
      }[];
    }[];
  };
  
  export type LessonRef = {
    slug: string;
    href: string;
    completed?: boolean;
  };
  
  export type UseFooterInput = {
    lessons: LessonRef[];
    currentSlug: string;
    onNavigate?: (href: string) => void;
  };
  
  export type UseFooterOutput = {
    prev: LessonRef | null;
    next: LessonRef | null;
    prevDisabled: boolean;
    nextDisabled: boolean;
    goPrev: () => void;
    goNext: () => void;
  };
  