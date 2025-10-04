// domains/profile/types.ts

export type Tab = "kursy" | "dane" | "ustalenia" | "platnosci" | "mobilna";

export type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  short_description?: string;
  first_lesson_id?: string;
};

export type Progress = {
  id: string;
  user_id: string;
  course: string;
  lesson_id: string;
  completed_exercises: boolean;
  updated_at: string;
};
export type Subscription = {
  id: string;
  user_id: string;
  status: "active" | "canceled" | "expired";
  payment_provider: string | null;
  payment_id: string | null;
  started_at: string | null;
  period_end: string;
  created_at: string;
  plan: "monthly" | "yearly";
  price_id: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  course: string | { id: string; title?: string };
  payment_status: "unpaid" | "paid" | "failed";
  paid_at: string | null;
  payment_provider: string | null;
  payment_id: string | null;
  created_at: string;
  price_id: string | null;
};

export type User = {
  id: string;
  email?: string;
};
