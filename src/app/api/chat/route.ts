import { openai } from '@ai-sdk/openai';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
} from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  // ✅ parse incoming data
  const {
    messages,
    course,
    topic,
    level,
  }: {
    messages: UIMessage[];
    course?: string;
    topic?: string;
    level?: string;
  } = await req.json();

  // ✅ build dynamic context for tutor
  const courseInfo = course ? `Course: ${course}.` : '';
  const topicInfo = topic ? `Topic: ${topic}.` : '';
  const levelInfo = level ? `Level: ${level}.` : '';

  // ✅ create dynamic system instructions
const systemPrompt = `
You are **MurAi**, a friendly AI English tutor for Polish learners.

Context:
${courseInfo}
${topicInfo}
${levelInfo}

Capabilities:
- If the user's English proficiency is unclear, you can *estimate* their level (A1–C2) based on their grammar, vocabulary, and fluency.
- Be humble and say it’s just an estimate.
- When asked “What is my level?”, reply with your best guess and explain why, e.g.:
  "I think your level is around B1 because you use good vocabulary and mostly correct grammar."
- Otherwise, continue teaching within the given course and topic.

Guidelines:
- Teach in English, but add short Polish hints if necessary.
- Avoid political, financial, or unrelated questions.
- If off-topic, gently redirect: “Nie mam informacji na ten temat. Jeśli chcesz, możemy wrócić do nauki angielskiego!”
- Be concise, encouraging, and polite.
`;

  // ✅ stream AI response
  const result = streamText({
    model: openai('gpt-4o'),
    maxOutputTokens: 600,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: systemPrompt,
  });

  return result.toUIMessageStreamResponse();
}
