import { AIProvider, AIMessagePayload, AIOptions, AIProviderResponse } from '../ai-provider.interface.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gemini-1.5-flash') {
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
      throw new Error('Gemini API key is not configured');
    }

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: options?.temperature ?? 0.3,
        maxOutputTokens: options?.maxTokens ?? 800,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((p: any) => p.text).join('') || '';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

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
      throw new Error('Gemini API key is not configured');
    }

    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const body: any = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: options?.temperature ?? 0.3,
        maxOutputTokens: options?.maxTokens ?? 800,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
            const partText = json.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
            if (partText) {
              fullText += partText;
              onChunk(partText);
            }
          } catch {
            // Ignore parse errors on SSE chunk boundaries
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
