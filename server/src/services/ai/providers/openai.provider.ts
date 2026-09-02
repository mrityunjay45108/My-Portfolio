import { AIProvider, AIMessagePayload, AIOptions, AIProviderResponse } from '../ai-provider.interface.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gpt-4o-mini') {
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
      throw new Error('OpenAI API key is not configured');
    }

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

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
      throw new Error('OpenAI API key is not configured');
    }

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 800,
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
        if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk(delta);
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
