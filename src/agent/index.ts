import { llm } from "./llm";
import { buildSystemPrompt } from "./prompts/system";

interface DraftInput {
  platform: string;
  rawContent: string;
  styleExamples?: string[];
}

export async function generateDraft({
  platform,
  rawContent,
  styleExamples = [],
}: DraftInput): Promise<string> {
  const system = buildSystemPrompt(platform, styleExamples);

  const result = await llm.chat(system, [
    {
      role: "user",
      content: `Here's the raw material to work with:\n\n${rawContent}`,
    },
  ]);

  return result.trim();
}
