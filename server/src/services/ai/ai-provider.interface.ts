export interface AIMessagePayload {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProviderResponse {
  content: string;
  tokensUsed?: number;
  model: string;
  latencyMs?: number;
}

export interface AIProvider {
  readonly name: string;
  generateResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    options?: AIOptions
  ): Promise<AIProviderResponse>;
  generateStreamingResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    options?: AIOptions
  ): Promise<AIProviderResponse>;
}
