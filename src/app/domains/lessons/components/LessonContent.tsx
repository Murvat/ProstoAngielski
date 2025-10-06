export default function LessonContent({ content }: { content: React.ReactNode }) {
    return (
      <section
        // id="htmlContent"
        className="relative z-0 flex-1 min-w-0 flex flex-col gap-9 prose prose-github dark:prose-invert max-w-4xl mx-auto"
      >
        {content}
      </section>
    );
  }
  