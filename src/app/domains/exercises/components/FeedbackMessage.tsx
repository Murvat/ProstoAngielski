export default function FeedbackMessage({
    type,
    message,
  }: {
    type: "correct" | "wrong" | "hint";
    message: string;
  }) {
    if (type === "correct") {
      return (
        <div className="w-full bg-green-50 border border-green-600 rounded p-3">
          <p className="text-green-800 font-semibold">{message}</p>
        </div>
      );
    }
  
    if (type === "wrong") {
      return (
        <div className="w-full bg-red-50 border border-red-500 rounded p-3">
          <p className="text-red-600 font-semibold">{message}</p>
        </div>
      );
    }
  
    return (
      <div className="flex items-start gap-3 w-full bg-amber-50 border border-amber-400 p-3 rounded">
        <div className="h-full w-2 bg-amber-400 rounded" />
        <p className="text-amber-900 text-sm font-medium">{message}</p>
      </div>
    );
  }
  