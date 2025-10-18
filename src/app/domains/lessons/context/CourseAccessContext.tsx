"use client";

import { createContext, useContext } from "react";

type CourseAccessContextValue = {
  hasFullAccess: boolean;
  accessLoading: boolean;
  freeLessonLimit: number;
};

export const CourseAccessContext =
  createContext<CourseAccessContextValue | null>(null);

export function useCourseAccessContext(): CourseAccessContextValue {
  const context = useContext(CourseAccessContext);
  if (!context) {
    throw new Error(
      "useCourseAccessContext must be used within CourseAccessContext.Provider"
    );
  }
  return context;
}
