import { XPublisher } from "./x";
import { LinkedInPublisher } from "./linkedin";
import type { Publisher } from "./types";

const publishers: Record<string, Publisher> = {
  x: new XPublisher(),
  linkedin: new LinkedInPublisher(),
};

export function getPublisher(platform: string): Publisher | null {
  return publishers[platform] ?? null;
}

export function getConfiguredPlatforms(): string[] {
  return Object.entries(publishers)
    .filter(([, p]) => p.isConfigured())
    .map(([name]) => name);
}

export type { PublishResult } from "./types";
