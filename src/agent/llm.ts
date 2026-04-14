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
  private getClient(): Anthropic {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not set. Run `npm run setup` or add it to .env");
    }
    return new Anthropic();
  }

  async chat(system: string, messages: Message[], options?: LLMOptions): Promise<string> {
    const client = this.getClient();
    const response = await client.messages.create({
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
