import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server/server";
import { getProgressEntry, upsertProgress } from "@/lib/supabase/queries";

export async function POST(req: Request) {
  const { topic, level, userNote, course, lessonId } = await req.json();
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const { data: progress, error: progressError } = await getProgressEntry(
    supabase,
    {
      userId,
      courseId: course,
      lessonId,
    }
  );

  if (progressError) {
    console.error("Supabase select error:", progressError);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if ((progress?.regenerate_count ?? 0) >= 3) {
    return Response.json(
      { error: "Regeneration limit reached (3 times maximum)" },
      { status: 403 }
    );
  }

  const systemPrompt = `
You are MurAi, a friendly AI English tutor for Polish learners.
Generate a Markdown lesson for the topic: "${topic}".
User level: ${level}.
${userNote ? `User request: ${userNote}` : ""}

Your goal:
- Create an engaging, easy-to-understand English lesson with Polish hints.
- Always include **clear explanations**, **vocabulary**, **grammar notes**, and **examples**.
- Include **tables** (for comparison or patterns) if useful.
${
  userNote?.toLowerCase().includes("exercise") ||
  userNote?.toLowerCase().includes("task") ||
  userNote?.toLowerCase().includes("cwiczenie")
    ? "- Add exercises or practice tasks as the user requested."
    : "- Do NOT add exercises or tasks unless the user specifically asks for them."
}

Output format:
- Use Markdown only (no HTML).
- Structure with clear headings and sections.
- Keep explanations concise and student-friendly.
`;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: "Generate the full Markdown lesson content now.",
    temperature: 0.8,
    maxOutputTokens: 1200,
  });

  const nextCount = (progress?.regenerate_count ?? 0) + 1;
  const upsertError = await upsertProgress(supabase, {
    user_id: userId,
    course,
    lesson_id: lessonId,
    completed_exercises: progress?.completed_exercises ?? false,
    updated_at: new Date().toISOString(),
    regenerate_count: nextCount,
  });

  if (upsertError) {
    console.error("Supabase upsert error:", upsertError);
    return Response.json({ error: "Database update failed" }, { status: 500 });
  }

  return Response.json({ content: text });
}
