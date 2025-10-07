import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { topic, level, userNote } = await req.json();

  const systemPrompt = `
You are MurAi, a friendly AI English tutor for Polish learners.
Generate a Markdown lesson for the topic: "${topic}".
User level: ${level}.
${userNote ? `User wants: ${userNote}` : ""}
Include:
- clear English explanations
- Polish hints
- examples and exercises
Return only Markdown text.
`;

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: "Generate the full Markdown lesson content now.",
    temperature: 0.8,
    maxOutputTokens: 1200,
  });

  // ✅ return plain markdown as JSON
  return Response.json({ content: text });
}
