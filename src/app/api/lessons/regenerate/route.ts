import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server/server";

export async function POST(req: Request) {
  const { topic, level, userNote, course,lessonId } = await req.json(); // ✅ include course
  const supabase = await createClient();

  // 1️⃣ Auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = user.id;

  // 2️⃣ Fetch progress for this user/course/lesson
  const { data: progress, error: progressError } = await supabase
    .from("progress")
    .select("id, regenerate_count")
    .eq("user_id", userId)
    .eq("course", course) // 👈 must match unique constraint
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (progressError) {
    console.error("Supabase select error:", progressError);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if (progress?.regenerate_count >= 3) {
    return Response.json(
      { error: "Regeneration limit reached (3 times maximum)" },
      { status: 403 }
    );
  }

  // 3️⃣ Generate lesson content
const systemPrompt = `
You are MurAi, a friendly AI English tutor for Polish learners.
Generate a Markdown lesson for the topic: "${topic}".
User level: ${level}.
${userNote ? `User request: ${userNote}` : ""}

Your goal:
- Create an engaging, easy-to-understand English lesson with Polish hints.
- Always include **clear explanations**, **vocabulary**, **grammar notes**, and **examples**.
- Include **tables** (for comparison or patterns) if useful.
${userNote?.toLowerCase().includes("exercise") ||
userNote?.toLowerCase().includes("task") ||
userNote?.toLowerCase().includes("ćwiczenie")
  ? "- Add exercises or practice tasks as the user requested."
  : "- Do NOT add exercises or tasks unless the user specifically asks for them."}

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

  // 4️⃣ Increment regenerate_count correctly
  const nextCount = (progress?.regenerate_count ?? 0) + 1;

  const { error: updateError } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        course, // 👈 include
        lesson_id: lessonId,
        regenerate_count: nextCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course,lesson_id" } // 👈 ensure update
    );

  if (updateError) {
    console.error("Supabase upsert error:", updateError);
    return Response.json({ error: "Database update failed" }, { status: 500 });
  }

  // 5️⃣ Return generated content
  return Response.json({ content: text });
}
