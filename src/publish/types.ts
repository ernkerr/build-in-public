export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface Publisher {
  platform: string;
  publish(content: string, imageUrl?: string | null): Promise<PublishResult>;
  isConfigured(): boolean;
}
