import type { CourseStructure, ExerciseData, PurchaseCourseRef } from "@/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Nullable<T> = T | null;

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: number;
          title: string;
          image_link: Nullable<string>;
          blog: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          image_link?: Nullable<string>;
          blog: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          image_link?: Nullable<string>;
          blog?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          price: Nullable<number>;
          level: Nullable<string>;
          short_description: Nullable<string>;
          duration: Nullable<string>;
          features: Nullable<string[]>;
          created_at: Nullable<string>;
          first_lesson_id: Nullable<string>;
          structure: Nullable<CourseStructure>;
          user_id: Nullable<string>;
        };
        Insert: {
          id?: string;
          title: string;
          price?: Nullable<number>;
          level?: Nullable<string>;
          short_description?: Nullable<string>;
          duration?: Nullable<string>;
          features?: Nullable<string[]>;
          created_at?: Nullable<string>;
          first_lesson_id?: Nullable<string>;
          structure?: Nullable<CourseStructure>;
          user_id?: Nullable<string>;
        };
        Update: {
          id?: string;
          title?: string;
          price?: Nullable<number>;
          level?: Nullable<string>;
          short_description?: Nullable<string>;
          duration?: Nullable<string>;
          features?: Nullable<string[]>;
          created_at?: Nullable<string>;
          first_lesson_id?: Nullable<string>;
          structure?: Nullable<CourseStructure>;
          user_id?: Nullable<string>;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          order_index: number;
          title: string;
          content_md: Nullable<string>;
          pdf_path: Nullable<string>;
          heading: Nullable<string>;
          exercises: Nullable<ExerciseData>;
        };
        Insert: {
          id?: string;
          course_id: string;
          order_index: number;
          title: string;
          content_md?: Nullable<string>;
          pdf_path?: Nullable<string>;
          heading?: Nullable<string>;
          exercises?: Nullable<ExerciseData>;
        };
        Update: {
          id?: string;
          course_id?: string;
          order_index?: number;
          title?: string;
          content_md?: Nullable<string>;
          pdf_path?: Nullable<string>;
          heading?: Nullable<string>;
          exercises?: Nullable<ExerciseData>;
        };
        Relationships: [];
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          course: string;
          lesson_id: string;
          completed_exercises: boolean;
          updated_at: string;
          regenerate_count: Nullable<number>;
        };
        Insert: {
          id?: string;
          user_id: string;
          course: string;
          lesson_id: string;
          completed_exercises: boolean;
          updated_at?: string;
          regenerate_count?: Nullable<number>;
        };
        Update: {
          id?: string;
          user_id?: string;
          course?: string;
          lesson_id?: string;
          completed_exercises?: boolean;
          updated_at?: string;
          regenerate_count?: Nullable<number>;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          course: PurchaseCourseRef;
          payment_status: "unpaid" | "paid" | "failed";
          paid_at: Nullable<string>;
          payment_provider: Nullable<string>;
          payment_id: Nullable<string>;
          created_at: string;
          price_id: Nullable<string>;
        };
        Insert: {
          id?: string;
          user_id: string;
          course: PurchaseCourseRef;
          payment_status: "unpaid" | "paid" | "failed";
          paid_at?: Nullable<string>;
          payment_provider?: Nullable<string>;
          payment_id?: Nullable<string>;
          created_at?: string;
          price_id?: Nullable<string>;
        };
        Update: {
          id?: string;
          user_id?: string;
          course?: PurchaseCourseRef;
          payment_status?: "unpaid" | "paid" | "failed";
          paid_at?: Nullable<string>;
          payment_provider?: Nullable<string>;
          payment_id?: Nullable<string>;
          created_at?: string;
          price_id?: Nullable<string>;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: "active" | "canceled" | "expired";
          payment_provider: Nullable<string>;
          payment_id: Nullable<string>;
          started_at: Nullable<string>;
          period_end: string;
          created_at: string;
          plan: "monthly" | "yearly" | "free_trial";
          price_id: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: "active" | "canceled" | "expired";
          payment_provider?: Nullable<string>;
          payment_id?: Nullable<string>;
          started_at?: Nullable<string>;
          period_end: string;
          created_at?: string;
          plan: "monthly" | "yearly" | "free_trial";
          price_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "active" | "canceled" | "expired";
          payment_provider?: Nullable<string>;
          payment_id?: Nullable<string>;
          started_at?: Nullable<string>;
          period_end?: string;
          created_at?: string;
          plan?: "monthly" | "yearly" | "free_trial";
          price_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: "user" | "admin" | null;
        };
        Insert: {
          id: string;
          role?: "user" | "admin" | null;
        };
        Update: {
          id?: string;
          role?: "user" | "admin" | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
