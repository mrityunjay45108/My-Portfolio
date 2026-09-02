import { AIProvider, AIMessagePayload, AIOptions, AIProviderResponse } from '../ai-provider.interface.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'claude-3-5-haiku-20241022') {
    this.apiKey = apiKey || process.env.AI_API_KEY || '';
    this.defaultModel = process.env.AI_MODEL || defaultModel;
  }

  async generateResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    options?: AIOptions
  ): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const model = options?.model || this.defaultModel;

    if (!this.apiKey) {
      throw new Error('Anthropic API key is not configured');
    }

    const formattedMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: formattedMessages,
        max_tokens: options?.maxTokens ?? 800,
        temperature: options?.temperature ?? 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const text = data.content?.map((c: any) => c.text).join('') || '';
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    return {
      content: text,
      tokensUsed,
      model,
      latencyMs: Date.now() - startTime,
    };
  }

  async generateStreamingResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    options?: AIOptions
  ): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const model = options?.model || this.defaultModel;

    if (!this.apiKey) {
      throw new Error('Anthropic API key is not configured');
    }

    const formattedMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: formattedMessages,
        max_tokens: options?.maxTokens ?? 800,
        temperature: options?.temperature ?? 0.3,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      return this.generateResponse(messages, systemPrompt, options);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      const lines = chunkText.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.type === 'content_block_delta' && json.delta?.text) {
              fullText += json.delta.text;
              onChunk(json.delta.text);
            }
          } catch {
            // Ignore boundary chunk errors
          }
        }
      }
    }

    return {
      content: fullText,
      model,
      latencyMs: Date.now() - startTime,
    };
  }
}
