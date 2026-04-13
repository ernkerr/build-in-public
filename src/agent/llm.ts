import Anthropic from "@anthropic-ai/sdk";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface LLMOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface LLMProvider {
  chat(system: string, messages: Message[], options?: LLMOptions): Promise<string>;
}

class ClaudeProvider implements LLMProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async chat(system: string, messages: Message[], options?: LLMOptions): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: options?.maxTokens ?? 1024,
      temperature: options?.temperature ?? 0.7,
      system,
      messages,
    });

    const block = response.content[0];
    if (block.type === "text") return block.text;
    throw new Error("Unexpected response type");
  }
}

export const llm: LLMProvider = new ClaudeProvider();
