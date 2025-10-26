import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

type FeedbackMessageProps = {
  type: "correct" | "wrong" | "hint";
  message: string;
};

export default function FeedbackMessage({ type, message }: FeedbackMessageProps) {
  if (type === "correct") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-inner">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
        <p className="font-semibold">{message}</p>
      </div>
    );
  }

  if (type === "wrong") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-inner">
        <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
        <p className="font-semibold">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-inner">
      <Lightbulb className="mt-0.5 h-5 w-5 text-amber-500" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

